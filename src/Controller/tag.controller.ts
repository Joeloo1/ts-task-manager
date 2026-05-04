import { Request, Response, NextFunction } from "express";
import { prisma } from "../Config/database";
import * as factory from "./handlerFactory";
import { getAllTagsService, createTagsService } from "../services/tag.service";
import catchAsync from "../utils/catchAsync";
import logger from "../Config/winston";

export const getAllTags = factory.getAll(getAllTagsService);
export const createTag = factory.createOne(createTagsService);

/*
export const getAllTags = factory.getAll(prisma.tag);
export const createTag = factory.createOne(prisma.tag);
*/

/*
export const getAllTags = catchAsync(async (req: Request, res: Response) => {
  const tags = await getAllTagsService();
  logger.info("Fetching all tags");
  res.status(200).json({
    status: "success",
    data: {
      tags,
    },
  });
});

export const createTag = catchAsync(async (req: Request, res: Response) => {
  const tag = await createTagsService(req.body.name);
  logger.info("Creating tag");
  res.status(201).json({
    status: "success",
    data: {
      tag,
    },
  });
});
*/
