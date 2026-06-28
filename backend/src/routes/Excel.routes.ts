
import { Router } from "express";

import * as excelController from "../controllers/Excel.controller";

import { uploadExcel } from "../middleware/upload.middleware";

const router = Router();

router.post(

    "/upload",

    uploadExcel.single("file"),

    excelController.uploadExcel

);

export default router;