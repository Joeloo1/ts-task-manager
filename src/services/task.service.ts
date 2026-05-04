import { prisma } from "../Config/database";
// import { Status, Priority } from "@prisma/client";
import * as factory from "./handlerFactory.service";
import AppError from "../utils/AppError";
import logger from "../Config/winston";

/*
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
*/

export const getAllTaskService = factory.getAll(prisma.task, {
  ownerField: "authorId",
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

export const getTaskById = factory.getOne(prisma.task, {
  ownerField: "authorId",
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

export const deleteTaskService = factory.deleteOne(prisma.task, {
  ownerField: "authorId",
});

export const createTaskService = async (userId: string, data: any) => {
  const { tagIds, ...taskData } = data;

  if (taskData.projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: taskData.projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      logger.warn("Project not found or access denied");
      throw new AppError("project not found or access denied", 404);
    }
  }

  logger.info(`User with ID: ${userId} creating a task`);

  const task = await prisma.task.create({
    data: {
      ...taskData,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      authorId: userId,
      tags: tagIds
        ? {
            connect: tagIds.map((id: string) => ({ id })),
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

export const UpdateTaskService = async (
  taskId: string,
  userId: string,
  data: any,
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

  logger.info(`Updating task with ID : ${taskId}`);
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

/*
export const createTaskService = async (
  userId: string,
  data: CreateTaskInput,
) => {
...
  await prisma.task.delete({
    where: { id: taskId },
  });
};
*/

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

  logger.info(`Adding tags to task`);

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

  logger.info("Removing tags from task");

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
