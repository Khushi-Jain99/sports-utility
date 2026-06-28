import express from "express";
import cors from "cors";
import morgan from "morgan";

import path from "path";

import excelRoutes from "./routes/Excel.routes";

import errorMiddleware from "./middleware/error.middleware";
import ApiError from "./utils/ApiError";

import studentRoutes from "./routes/Student.routes";

import achievementRoutes from "./routes/Achievement.routes";

import dashboardRoutes from "./routes/Dashboard.routes";

import authRoutes from "./routes/Auth.routes";
import adminRoutes from "./routes/Admin.routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/achievements", achievementRoutes);
app.use("/api/v1/excel", excelRoutes);

app.use("/api/v1/auth", authRoutes);


app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
);

app.use(
  "/api/v1/dashboard",
  dashboardRoutes
);

app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Sports Utility API Running",
    });
});

// 404 Handler
app.use((req, res, next) => {
    next(new ApiError(404, "Route Not Found"));
});

// Global Error Handler
app.use(errorMiddleware);

export default app;