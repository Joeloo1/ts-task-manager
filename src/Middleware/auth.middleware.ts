import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { prisma } from "../Config/database";

interface DecodedToken {
  id: string;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
      };
    }
  }
}

// PROTECT MIDDLEWARE
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in, Please try again later", 401),
      );
    }

    // VERIFY TOKEN
    let decoded: DecodedToken;
    try {
      decoded = (await JWT.verify(
        token,
        process.env.JWT_SECRET as string,
      )) as DecodedToken;
    } catch (error) {
      const message =
        error instanceof Error && error.message === "jwt expired"
          ? "Token expired, please login again"
          : "Invalid token, please login again";
      return next(new AppError(message, 401));
    }

    // CHECK IF USER EXIST
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(
        new AppError("User belonging to this token no longer exists", 401),
      );
    }

    req.user = currentUser;
    next();
  },
);
