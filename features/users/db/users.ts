"server-only";

import { eq, or } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema/users";

import {
  CurrentUserQuery,
  User,
  UserCreatePayload,
} from "@/features/users/types/users";
import { supabase } from "@/lib/supabase";

const createUser = async (payload: UserCreatePayload) => {
  const exists = await db
    .select()
    .from(usersTable)
    .where(
      or(eq(usersTable.email, payload.email), eq(usersTable.name, payload.name))
    );

  if (exists.length != 0) {
    throw new Error("User already exists");
  }

  const bucket = await supabase().storage.createBucket(payload.name, {
    public: true,
    fileSizeLimit: 50 * 1000 * 1000,
  });

  if (bucket.error) {
    throw new Error("Failed to create a storage bucket, try again later");
  }

  return db.insert(usersTable).values(payload);
};

const getUsers = async (): Promise<User[]> => {
  return db.select().from(usersTable).execute();
};

const getCurrentUser = async (payload: CurrentUserQuery): Promise<User> => {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, payload.userId))
    .execute();

  return result[0];
};

export const users = {
  api: {
    createUser,
    getUsers,
    getCurrentUser,
  },
};
