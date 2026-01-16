import { z } from "zod";
import { Status, Priority } from "@prisma/client";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.nativeEnum(Status).default("TODO"),
    priority: z.nativeEnum(Priority).default("MEDIUM"),
    dueDate: z.string().datetime().optional(),
    projectId: z.string().uuid().optional(),
    tagIds: z.array(z.string().uuid()).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.nativeEnum(Status).optional(),
    priority: z.nativeEnum(Priority).optional(),
    dueDate: z.string().datetime().optional(),
    projectId: z.string().uuid().optional(),
  }),
});
