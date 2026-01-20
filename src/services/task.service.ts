import { prisma } from "../Config/database";
import { Status, Priority } from "@prisma/client";
import AppError from "../utils/AppError";

interface CreateTaskInput {
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  dueDate?: string;
  projectId?: string;
  tagIds?: string[];
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  dueDate?: string;
  projectId?: string;
}

interface TaskFilters {
  status?: string;
  priority?: string;
  projectId?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const createTaskService = async (
  userId: string,
  data: CreateTaskInput,
) => {
  const { tagIds, ...taskData } = data;

  if (taskData.projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: taskData.projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new AppError("project not found or access denied", 404);
    }
  }

  const task = await prisma.task.create({
    data: {
      ...taskData,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      authorId: userId,
      tags: tagIds
        ? {
            connect: tagIds.map((id) => ({ id })),
          }
        : undefined,
    },
    include: {
      tags: true,
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return task;
};

export const getAllTaskService = async (
  userId: string,
  filter: TaskFilters,
): Promise<PaginatedResponse<any>> => {
  const { status, priority, projectId, page = 1, limit = 10 } = filter;

  const where: Record<string, any> = { authorId: userId };

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (projectId) where.projectId = projectId;

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        tags: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: tasks,
    total,
    page,
    limit,
    totalPages,
  };
};

export const getTaskById = async (taskId: string, userId: string) => {
  if (!taskId) {
    throw new AppError("Task ID is required", 400);
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      authorId: userId,
    },
    include: {
      tags: true,
      project: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

export const UpdateTaskService = async (
  taskId: string,
  userId: string,
  data: UpdateTaskInput,
) => {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      authorId: userId,
    },
  });

  if (!existingTask) {
    throw new AppError("Task not found", 404);
  }

  if (data.projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new AppError("Project not found or access denied", 404);
    }
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
    include: {
      tags: true,
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return task;
};

export const deleteTaskService = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      authorId: userId,
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
};

export const addTagsToTaskService = async (
  taskId: string,
  userId: string,
  tagIds: string[],
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      authorId: userId,
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      tags: {
        connect: tagIds.map((id) => ({ id })),
      },
    },
    include: {
      tags: true,
    },
  });

  return updatedTask;
};

export const removeTagsService = async (
  taskId: string,
  userId: string,
  tagIds: string[],
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      authorId: userId,
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      tags: {
        disconnect: tagIds.map((id) => ({ id })),
      },
    },
    include: {
      tags: true,
    },
  });

  return updatedTask;
};
