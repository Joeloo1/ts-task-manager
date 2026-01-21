import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { getAllTagsService, createTagsService } from "../services/tag.service";
import logger from "../Config/winston";

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
