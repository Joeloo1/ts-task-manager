import { z } from "zod";

// sign up schema
export const SignUpSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 2 characters long" }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password mst be at least 8 characters long"),
  }),
});

// Login schema
export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});
