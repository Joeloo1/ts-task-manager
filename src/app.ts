import express from "express";
import morgan from "morgan";
import authRoutes from "./Router/auth.routes";
import { globalErrorHandler } from "./Error/globalErrorHandler";
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", authRoutes);

app.use(globalErrorHandler);
export default app;
