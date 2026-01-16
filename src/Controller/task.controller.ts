import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import {
  createTaskService,
  getAllTaskService,
  getTaskById,
} from "../services/task.service";
import AppError from "../utils/AppError";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
  };
}
export const createTask = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const task = await createTaskService(userId, req.body);

    res.status(201).json({
      status: "success",
      data: {
        task,
      },
    });
  },
);

export const getAllTask = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { status, priority, projectId, page = "1", limit = "10" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string) || 10),
    );

    const result = await getAllTaskService(userId, {
      status: status as string | undefined,
      priority: priority as string | undefined,
      projectId: projectId as string | undefined,
      page: pageNum,
      limit: limitNum,
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);

export const getTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  if (!id || Array.isArray(id)) {
    throw new AppError("Invalid task ID", 400);
  }

  const task = await getTaskById(id, userId);

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});
