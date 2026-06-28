import { Request, Response } from "express";

import catchAsync from "../utils/catchAsync";

import ApiResponse from "../utils/ApiResponse";

import * as authService from "../services/Auth.service";

export const login = catchAsync(

  async (req: Request, res: Response) => {

    const data =
      await authService.login(

        req.body.username,

        req.body.password

      );

    res.status(200).json(

      new ApiResponse(

        200,

        "Login Successful",

        data

      )

    );

  }

);