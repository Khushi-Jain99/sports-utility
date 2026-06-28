import { Router } from "express";

import { protect } from "../middleware/auth";

import {
  updateCredentials,
} from "../controllers/Admin.controller";

const router = Router();

router.put(
  "/credentials",
  protect,
  updateCredentials
);

export default router;