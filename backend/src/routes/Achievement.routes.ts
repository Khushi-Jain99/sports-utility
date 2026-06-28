
import { Router } from "express";
import * as controller from "../controllers/Achievement.controller";
import { uploadCertificate } from "../middleware/upload.middleware";

import { protect } from "../middleware/auth";

const router = Router();


router.post("/", protect, controller.createAchievement);
router.get("/",  protect, controller.getAllAchievements);
router.get("/:id",  protect, controller.getAchievementById);
router.patch("/:id",  protect, controller.updateAchievement);
router.delete("/:id",  protect, controller.deleteAchievement);

router.post(

    "/:id/certificate", protect,

    uploadCertificate.single("certificate"),

    controller.uploadCertificate

);

export default router;