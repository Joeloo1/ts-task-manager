import express from "express";
import morgan from "morgan";
import authRoutes from "./Router/auth.routes";
import taskRoutes from "./Router/task.routes";
import projectRoutes from "./Router/project.routes";
import tagRoutes from "./Router/tag.routes";

import { globalErrorHandler } from "./Error/globalErrorHandler";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/tags", tagRoutes);

app.use(globalErrorHandler);
export default app;
