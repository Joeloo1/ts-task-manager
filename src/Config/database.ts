import { PrismaClient } from "@prisma/client";
import config from "./config.env";
import logger from "./winston";

export const prisma = new PrismaClient({
  log:
    config.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info("🟢 DB Connected via Prisma");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`DB connection error: ${message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};
