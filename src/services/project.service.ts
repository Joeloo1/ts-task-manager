import { prisma } from "../Config/database";
import * as factory from "./handlerFactory.service";
// import AppError from "../utils/AppError";
// import logger from "../Config/winston";

/*
interface CreateProjectInput {
  name: string;
  description?: string;
}

interface UpdateProjectInput {
  name?: string;
  description?: string;
}
*/

export const getAllProjectService = factory.getAll(prisma.project, {
  ownerField: "ownerId",
  include: {
    _count: {
      select: { tasks: true },
    },
  },
});

export const getProjectService = factory.getOne(prisma.project, {
  ownerField: "ownerId",
  include: {
    tasks: {
      include: {
        tags: true,
      },
    },
  },
});

export const createProjectService = factory.createOne(prisma.project, {
  ownerField: "ownerId",
});

export const updateProjectService = (
  projectId: string,
  userId: string,
  data: any,
) =>
  factory.updateOne(prisma.project, { ownerField: "ownerId" })(
    projectId,
    data,
    userId,
  );

export const deleteProjectService = factory.deleteOne(prisma.project, {
  ownerField: "ownerId",
});

/*
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
    logger.warn("Project not found");
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
*/
