import { prisma } from "../Config/database";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import AppError from "../utils/AppError";
import logger from "../Config/winston";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const register = async ({ email, name, password }: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    logger.warn("Email already in use", email);
    throw new AppError("Email already in use", 400);
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
  const token = signToken({ id: newUser.id });

  return { newUser, token };
};

export const Login = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    logger.warn("Incorrect email or password");
    throw new AppError("Incorrect email or password", 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Incorrect email and password", 401);
  }

  const token = signToken({ id: user.id });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};
