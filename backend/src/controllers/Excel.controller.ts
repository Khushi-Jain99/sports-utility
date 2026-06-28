
import { Request, Response } from "express";

import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

import * as excelService from "../services/Excel.service";

export const uploadExcel = catchAsync(

    async (req: Request, res: Response) => {

        if (!req.file) {

            throw new ApiError(
                400,
                "Excel file is required"
            );

        }

        const report =
            await excelService.uploadExcel(
                req.file.path
            );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Excel imported successfully",

                report

            )

        );

    }

);