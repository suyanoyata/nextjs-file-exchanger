import { z } from "zod";

import { usersTable } from "@/db/schema/users";

export type UserCreatePayload = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
export type CurrentUserQuery = {
  userId: number;
};

const LoginUserPayloadSchema = z.object({
  email: z.string(),
});

export type LoginUserPayload = z.infer<typeof LoginUserPayloadSchema>;
