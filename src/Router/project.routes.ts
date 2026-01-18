import express from "express";
import {
  getAllProject,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../Controller/project.controller";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../Schema/project.schema";
import { protect } from "../Middleware/auth.middleware";
import { validateRequest } from "../Middleware/validation.middleware";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getAllProject)
  .post(validateRequest(createProjectSchema), createProject);

router
  .route("/:id")
  .get(getProjectById)
  .patch(validateRequest(updateProjectSchema), updateProject)
  .delete(deleteProject);

export default router;
