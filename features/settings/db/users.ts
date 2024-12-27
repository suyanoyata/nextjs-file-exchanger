"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema/users";
import { users } from "@/features/users/db/users";
import { eq } from "drizzle-orm";

export const updateExpirationTime = async (expirationTime: number) => {
  const user = await users.api.getCurrentUser();

  if (user.error || !user.data) {
    return {
      data: null,
      error: "Something went wrong",
    };
  }

  await db
    .update(usersTable)
    .set({ expirationMinutes: expirationTime })
    .where(eq(usersTable.id, user.data.id))
    .execute();

  return {
    data: "Success",
    error: null,
  };
};

// export const settings = {
//   api: {
//     updateExpirationTime,
//   },
// };
