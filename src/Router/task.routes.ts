import express from "express";
import { validateRequest } from "../Middleware/validation.middleware";
import {
  createTask,
  getAllTask,
  getTask,
  updateTask,
  deleteTask,
  addTagsToTask,
  removeTagsFromTask,
} from "../Controller/task.controller";
import { createTaskSchema, updateTaskSchema } from "../Schema/task.schema";
import { protect } from "../Middleware/auth.middleware";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getAllTask)
  .post(validateRequest(createTaskSchema), createTask);

router
  .route("/:id")
  .get(getTask)
  .patch(validateRequest(updateTaskSchema), updateTask)
  .delete(deleteTask);

router.route("/:taskId/tags").patch(addTagsToTask);
router.route("/:taskId/tags/:tagId").delete(removeTagsFromTask);

export default router;
