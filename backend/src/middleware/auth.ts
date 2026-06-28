import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new ApiError(
        401,
        "Unauthorized"
      );
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    req.user = decoded;

    next();

  } catch {

    next(
      new ApiError(
        401,
        "Invalid or Expired Token"
      )
    );

  }
};