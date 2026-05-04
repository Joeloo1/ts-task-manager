import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
// import AppError from "../utils/AppError";
import logger from "../Config/winston";

export const deleteOne = (serviceMethod: Function) =>
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    await serviceMethod(id, userId);

    logger.info(`Deleted document with ID: ${id}`);

    res.status(200).json({
      status: "success",
      message: "Resource deleted successfully",
      data: null,
    });
  });

export const updateOne = (serviceMethod: Function) =>
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const doc = await serviceMethod(id, userId, req.body);

    logger.info(`Updated document with ID: ${id}`);

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const createOne = (serviceMethod: Function) =>
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const doc = await serviceMethod(userId, req.body);

    logger.info(`Created new document`);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getOne = (serviceMethod: Function) =>
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const doc = await serviceMethod(id, userId);

    logger.info(`Fetched document with ID: ${id}`);

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getAll = (serviceMethod: Function) =>
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { page, limit, ...filters } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    const result = await serviceMethod(userId, {
      ...filters,
      page: pageNum,
      limit: limitNum,
    });

    logger.info(`Fetched all documents`);

    res.status(200).json({
      status: "success",
      data: result,
    });
  });
