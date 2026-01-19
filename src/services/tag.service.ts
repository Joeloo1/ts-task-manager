import { prisma } from "../Config/database";
import AppError from "../utils/AppError";

export const getAllTagsService = async () => {
  const tags = await prisma.tag.findMany();
  return tags;
};

export const createTagsService = async (name: string) => {
  const existingTag = await prisma.tag.findUnique({
    where: { name },
  });

  if (existingTag) {
    throw new AppError("Tag already exist", 400);
  }

  const tag = await prisma.tag.create({
    data: { name },
  });

  return tag;
};
