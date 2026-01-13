import { Request, Response, NextFunction } from "express";

type AsyncFuntion = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const catchAsync = (fn: AsyncFuntion) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
