"server-only";

import { eq, or } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema/users";

import {
  CurrentUserQuery,
  LoginUserPayload,
  User,
  UserCreatePayload,
} from "@/features/users/types/users";
import { supabase } from "@/lib/supabase";
import { token } from "@/features/users/utils/token";

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

const loginUser = async (payload: LoginUserPayload) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, payload.email))
    .limit(1)
    .execute();

  if (user.length == 0) {
    return {
      data: null,
      error: "User not found",
    };
  }

  return {
    data: user[0],
    error: null,
  };
};

const getUsers = async (): Promise<User[]> => {
  return db.select().from(usersTable).execute();
};

const getCurrentUser = async () => {
  const { data, error } = await token.api.readToken();

  if (error || !data) {
    return {
      data: null,
      error,
    };
  }

  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.name, data.name))
    .execute();

  return {
    data: result[0],
    error: null,
  };
};

export const users = {
  api: {
    createUser,
    loginUser,
    getUsers,
    getCurrentUser,
  },
};
