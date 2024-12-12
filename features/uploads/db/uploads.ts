"server-only";

import { desc, eq } from "drizzle-orm";

import { supabase } from "@/lib/supabase";

import { db } from "@/db";
import { uploadTable } from "@/db/schema/uploads";
import { usersTable } from "@/db/schema/users";

import { storage } from "@/features/uploads/db/storage";

import {
  UploadCreatePayload,
  UploadItem,
} from "@/features/uploads/types/uploads";

const createUpload = async (
  payload: Omit<UploadCreatePayload, "generatedFileName">,
  file: File
) => {
  const generatedFileName = `${
    Math.random().toString(18).substring(-2).split(".")[1]
  }.${file.name.split(".").pop()}`;

  const upload = await supabase()
    .storage.from("Alice")
    .upload(generatedFileName, file);

  if (upload.error) {
    return {
      data: null,
      error: upload.error,
    };
  }

  return {
    data: await db.insert(uploadTable).values({
      ...payload,
      generatedFileName,
    }),
    error: null,
  };
};

const getUserUploads = async (): Promise<UploadItem[]> => {
  // TODO: get user id or name from cookie, user it for bucket name then
  const list = await db
    .select()
    .from(uploadTable)
    .where(eq(uploadTable.userId, 1))
    .orderBy(desc(uploadTable.id))
    .execute();

  if (list.length == 0) {
    return [];
  }

  const result = await Promise.all(
    list.map(async (item) => {
      const fileData = await storage.api.getStorageItemByFileName(
        "Alice",
        item.generatedFileName
      );
      const url = storage.api.getFilePublicUrl("Alice", item.generatedFileName);

      return {
        ...fileData.data?.[0],
        ...item,
        url,
      };
    })
  );

  return result;
};

const getUploadByName = async (name: string) => {
  const items = await db
    .select()
    .from(uploadTable)
    .where(eq(uploadTable.generatedFileName, name));

  if (items.length == 0) {
    throw new Error("This upload does not exist");
  }

  const uploadCreator = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, items[0].userId));

  const url = storage.api.getFilePublicUrl(uploadCreator[0].name, name);

  return url;
};

const clearUserUploads = async () => {
  await storage.api.clearBucket("Alice");
  await db.delete(uploadTable).where(eq(uploadTable.userId, 1));

  return {
    message: "All uploads have been deleted",
  };
};

export const uploads = {
  api: {
    createUpload,
    clearUserUploads,
    getUploadByName,
    getUserUploads,
  },
};
