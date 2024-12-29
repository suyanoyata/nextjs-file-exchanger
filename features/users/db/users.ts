"server-only";

import bcrypt from "bcrypt";
import { eq, or } from "drizzle-orm";

import { db } from "@/db";

import { usersTable } from "@/db/schema/users";
import {
  DbUserCreate,
  LoginUserPayload,
  User,
  UserCreatePayload,
} from "@/features/users/types/users";

import { supabase } from "@/lib/supabase";

import { token } from "@/features/users/utils/token";

const createUser = async (payload: UserCreatePayload) => {
  // #region check if user exists
  const emailExists = await db
    .select()
    .from(usersTable)
    .where(
      or(eq(usersTable.email, payload.email), eq(usersTable.name, payload.name))
    );

  const nameExists = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.name, payload.name));

  if (emailExists.length != 0 || nameExists.length != 0) {
    return {
      data: null,
      error: [
        emailExists.length != 0 && {
          where: "email",
          message: "User with this email already exists",
        },
        nameExists.length != 0 && {
          where: "name",
          message: "User with this name already exists",
        },
      ],
    };
  }
  // #endregion

  // #region create a storage bucket
  const bucket = await supabase().storage.createBucket(payload.name, {
    public: true,
    fileSizeLimit: 50 * 1000 * 1000,
  });

  if (bucket.error && bucket.error.message != "The resource already exists") {
    return {
      data: null,
      error: [
        {
          where: "root",
          message: "Storage allocation has failed, try again later",
        },
      ],
    };
  }
  // #endregion

  const dbUser: DbUserCreate = {
    ...payload,
    createdAt: new Date(),
    apiKey: "",
    password: await bcrypt.hash(payload.password, 10),
  };

  await db.insert(usersTable).values({
    ...dbUser,
  });

  // #region assign upload api key
  const newUser = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.name, payload.name)));

  const apiKey = await token.api.signToken(newUser[0]);

  await db
    .update(usersTable)
    .set({ apiKey })
    .where(eq(usersTable.name, newUser[0].name));
  // #endregion

  return {
    data: {
      ...newUser[0],
      apiKey,
    },
    error: null,
  };
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
      error: [
        {
          where: "email",
          message: "User with this email doesn't exist",
        },
      ],
    };
  }

  if (!(await bcrypt.compare(payload.password, user[0].password))) {
    return {
      data: null,
      error: [
        {
          where: "password",
          message: "Password is incorrect",
        },
      ],
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

const getUserById = async (userId: number): Promise<User> => {
  return (
    await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .execute()
  )[0];
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
    getUserById,
    createUser,
    loginUser,
    getUsers,
    getCurrentUser,
  },
};
