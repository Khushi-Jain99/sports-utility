import bcrypt from "bcryptjs";

import Admin from "../models/Admin";

import ApiError from "../utils/ApiError";

import { generateToken } from "../utils/generateToken";

export const login = async (
  username: string,
  password: string
) => {

  if (password.length < 10) {

    throw new ApiError(
        400,
        "Password must be at least 10 characters."
    );

}

  const admin = await Admin.findOne({
    username,
  });



  if (!admin) {

    throw new ApiError(
      401,
      "Invalid username or password"
    );

  }

  const match = await bcrypt.compare(
    password,
    admin.password
  );

  if (!match) {

    throw new ApiError(
      401,
      "Invalid username or password"
    );

  }

  const token = generateToken(
    admin._id.toString(),
    admin.role
  );

  return {

    token,

    admin: {

      id: admin._id,

      username: admin.username,

      role: admin.role,

    },

  };

};