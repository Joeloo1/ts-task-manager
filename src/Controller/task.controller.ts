import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import {
  createTaskService,
  getAllTaskService,
  getTaskById,
  UpdateTaskService,
  deleteTaskService,
  addTagsToTaskService,
  removeTagsService,
} from "../services/task.service";
import AppError from "../utils/AppError";
import logger from "../Config/winston";

export const createTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const task = await createTaskService(userId, req.body);

  logger.info(`User with ID: ${userId} Creating task`);

  res.status(201).json({
    status: "success",
    data: {
      task,
    },
  });
});

export const getAllTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { status, priority, projectId, page = "1", limit = "10" } = req.query;

  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));

  const result = await getAllTaskService(userId, {
    status: status as string | undefined,
    priority: priority as string | undefined,
    projectId: projectId as string | undefined,
    page: pageNum,
    limit: limitNum,
  });

  logger.info(`User with ID: ${userId} Fetching all tasks`);
  res.status(200).json({
    status: "success",
    data: result,
  });
});

export const getTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  if (!id || Array.isArray(id)) {
    logger.warn(`Invalid task ID: ${id}`);
    throw new AppError("Invalid task ID", 400);
  }

  const task = await getTaskById(id, userId);
  logger.info(`User with ID: ${userId} getting a task`);

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

export const updateTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const task = await UpdateTaskService(
    req.params.id as string,
    userId,
    req.body,
  );

  logger.info("Updating task", task.id);
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  await deleteTaskService(req.params.id as string, req.user!.id);
  logger.info("deleting task");
  res.status(200).json({
    status: "success",
    message: "Task deleted successfully",
  });
  logger.info("Task deleted successfully");
});

export const addTagsToTask = async (req: Request, res: Response) => {
  const taskId = String(req.params.taskId);
  const { tagIds } = req.body;
  const userId = req.user!.id;

  if (!Array.isArray(tagIds) || tagIds.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "tagIds must be a non-empty array",
    });
  }

  const task = await addTagsToTaskService(taskId, userId, tagIds);

  res.status(200).json({
    status: "success",
    data: task,
  });
};

export const removeTagsFromTask = catchAsync(
  async (req: Request, res: Response) => {
    const task = await removeTagsService(
      req.params.taskId as string,
      req.user!.id,
      [req.params.tagId as string],
    );

    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  },
);
