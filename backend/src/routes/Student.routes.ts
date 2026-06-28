
import { Router } from "express";

import * as studentController from "../controllers/Student.controller";

import { uploadPhoto } from "../middleware/upload.middleware";

import { protect } from "../middleware/auth";

const router = Router();

router.post("/",protect, studentController.createStudent);

router.get("/",protect, studentController.getAllStudents);

router.get("/:id",protect, studentController.getStudentById);

router.patch("/:id",protect, studentController.updateStudent);

router.delete("/:id",protect, studentController.deleteStudent);

router.post(
    "/:id/photo",protect,
    uploadPhoto.single("photo"),
    studentController.uploadPhoto
);

export default router;

