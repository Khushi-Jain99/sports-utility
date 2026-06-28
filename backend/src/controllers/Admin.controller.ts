import { Response } from "express";
import bcrypt from "bcryptjs";

import Admin from "../models/Admin";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import catchAsync from "../utils/catchAsync";

export const updateCredentials = catchAsync(
  async (req: any, res: Response) => {

    const {
      username,
      currentPassword,
      newPassword,
    } = req.body;

    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    // ==========================
    // Verify Current Password
    // ==========================

    const match = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!match) {
      throw new ApiError(
        401,
        "Current password is incorrect"
      );
    }

    // ==========================
    // Update Username
    // ==========================

    if (username && username.trim() !== "") {

      const existing = await Admin.findOne({
        username: username.trim(),
      });

      if (
        existing &&
        existing._id.toString() !==
          admin._id.toString()
      ) {
        throw new ApiError(
          400,
          "Username already exists"
        );
      }

      admin.username = username.trim();

    }

    // ==========================
    // Update Password
    // ==========================

    if (newPassword && newPassword !== "") {

      if (newPassword.length < 10) {

        throw new ApiError(
          400,
          "Password must be at least 10 characters."
        );

      }

      admin.password = await bcrypt.hash(
        newPassword,
        10
      );

    }

    await admin.save();

    res.json(
      new ApiResponse(
        200,
        "Credentials Updated Successfully",
        {
          username: admin.username,
        }
      )
    );

  }
);