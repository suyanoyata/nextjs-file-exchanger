import { z } from "zod";

import { usersTable } from "@/db/schema/users";

export type UserCreatePayload = Omit<DbUserCreate, "apiKey" | "createdAt">;
export type DbUserCreate = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
export type CurrentUserQuery = {
  userId: number;
};

export const UserCreatePayloadSchema = z.object({
  name: z.string(),
  email: z.string().email({
    message: "Incorrect email format",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(255, {
      message: "Your password is too long",
    }),
});

export const LoginUserPayloadSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(255, {
      message: "Your password is too long",
    }),
});

export type LoginUserPayload = z.infer<typeof LoginUserPayloadSchema>;
