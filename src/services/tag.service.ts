import { prisma } from "../Config/database";
import AppError from "../utils/AppError";
import logger from "../Config/winston";

export const getAllTagsService = async () => {
  const tags = await prisma.tag.findMany();
  logger.info("Fetching all tags");
  return tags;
};

export const createTagsService = async (name: string) => {
  const existingTag = await prisma.tag.findUnique({
    where: { name },
  });

  if (existingTag) {
    logger.warn("Tag already exist");
    throw new AppError("Tag already exist", 400);
  }

  const tag = await prisma.tag.create({
    data: { name },
  });
  logger.info("Creating tag");

  return tag;
};
