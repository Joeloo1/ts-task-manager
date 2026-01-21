import { Request, Response, NextFunction } from "express";
import {
  getAllProjectService,
  getProjectService,
  createProjectService,
  updateProjectService,
  deleteProjectService,
} from "../services/project.service";
import catchAsync from "../utils/catchAsync";
import logger from "../Config/winston";

export const getAllProject = catchAsync(async (req: Request, res: Response) => {
  const project = await getAllProjectService(req.user!.id);
  logger.info("Fetching all project");
  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});

export const getProjectById = catchAsync(
  async (req: Request, res: Response) => {
    const project = await getProjectService(
      req.user!.id,

      req.params.id as string,
    );
    logger.info("Fetching a project by id", project.id);
    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  },
);

export const createProject = catchAsync(async (req: Request, res: Response) => {
  const project = await createProjectService(req.user!.id, req.body);
  logger.info("Creating project");
  res.status(201).json({
    status: "success",
    data: {
      project,
    },
  });
});

export const updateProject = catchAsync(async (req: Request, res: Response) => {
  const project = await updateProjectService(
    req.params.id as string,
    req.user!.id,
    req.body,
  );
  logger.info("updating project", project.id);
  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});

export const deleteProject = catchAsync(async (req: Request, res: Response) => {
  await deleteProjectService(req.params.id as string, req.user!.id);
  logger.info("Deleting project");
  res.status(200).json({
    status: "success",
    message: "Project deleted successfully",
  });
});
