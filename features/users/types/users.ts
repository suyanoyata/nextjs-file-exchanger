import { usersTable } from "@/db/schema/users";

export type UserCreatePayload = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
export type CurrentUserQuery = {
  userId: number;
};
