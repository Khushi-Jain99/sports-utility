import { Router } from "express";

import * as dashboardController from "../controllers/Dashboard.controller";

import { protect } from "../middleware/auth";

const router = Router();

router.get(
  "/", protect, 
  dashboardController.getDashboard
);

export default router;