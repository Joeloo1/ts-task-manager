import { Request, Response, NextFunction } from "express";
import { register, Login } from "./../services/auth.service";
import catchAsync from "../utils/catchAsync";
import logger from "../Config/winston";

export const SignUp = catchAsync(async (req: Request, res: Response) => {
  const user = await register(req.body);
  logger.info("User signed up successfully");
  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await Login(req.body);
    logger.info("User logged in");
    res.status(200).json({
      status: "success",
      data: user,
    });
  },
);
