import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import authRoutes from "./Router/auth.routes";
import taskRoutes from "./Router/task.routes";
import projectRoutes from "./Router/project.routes";
import tagRoutes from "./Router/tag.routes";

import { globalErrorHandler } from "./Error/globalErrorHandler";
import config from "./Config/config.env";
const app = express();

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Limiting from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many request from this IP, Please try again in an hour!",
});

app.use("/api", limiter);
app.use(helmet());

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/tags", tagRoutes);

app.use(globalErrorHandler);

export default app;
