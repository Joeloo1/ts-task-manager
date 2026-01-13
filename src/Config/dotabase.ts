import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["error"],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("🟢 DB Connected via Prisma");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`DB connection error: ${message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};
