import { prisma } from "../Config/database";
import AppError from "../utils/AppError";

interface CreateProjectInput {
  name: string;
  description?: string;
}

interface UpdateProjectInput {
  name?: string;
  description?: string;
}

export const getAllProjectService = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return projects;
};

export const getProjectService = async (userId: string, projectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      ownerId: userId,
    },
    include: {
      tasks: {
        include: {
          tags: true,
        },
      },
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

export const createProjectService = async (
  userId: string,
  data: CreateProjectInput,
) => {
  const project = await prisma.project.create({
    data: {
      ...data,
      ownerId: userId,
    },
  });
  return project;
};

export const updateProjectService = async (
  projectId: string,
  userId: string,
  data: UpdateProjectInput,
) => {
  const existingProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });

  if (!existingProject) {
    throw new AppError("Project not found", 404);
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data,
  });

  return project;
};

export const deleteProjectService = async (
  projectId: string,
  userId: string,
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await prisma.project.delete({
    where: { id: projectId },
  });
};
