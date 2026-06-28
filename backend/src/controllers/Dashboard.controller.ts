import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import ApiResponse from "../utils/ApiResponse";

import * as dashboardService from "../services/Dashboard.service";

export const getDashboard = catchAsync(
  async (req: Request, res: Response) => {
    const data = await dashboardService.getDashboardData();

    res.status(200).json(
      new ApiResponse(
        200,
        "Dashboard fetched successfully",
        data
      )
    );
  }
);