import express from "express";
import { validateRequest } from "../Middleware/validation.middleware";
import { createTask, getAllTask, getTask } from "../Controller/task.controller";
import { createTaskSchema, updateTaskSchema } from "../Schema/task.schema";
import { protect } from "../Middleware/auth.middleware";

const router = express.Router();

router
  .route("/")
  .get(protect, getAllTask)
  .post(protect, validateRequest(createTaskSchema), createTask);

router.route("/:id").get(protect, getTask);

export default router;
