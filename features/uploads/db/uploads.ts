"server-only";

import { desc, eq, lt } from "drizzle-orm";

import { supabase } from "@/lib/supabase";

import { db } from "@/db";
import { uploadTable } from "@/db/schema/uploads";
import { usersTable } from "@/db/schema/users";

import { storage } from "@/features/uploads/db/storage";

import {
  UploadCreatePayload,
  UploadItem,
} from "@/features/uploads/types/uploads";
import { token } from "@/features/users/utils/token";
import { users } from "@/features/users/db/users";

const createUpload = async (
  payload: Omit<UploadCreatePayload, "generatedFileName">,
  file: File,
  expirationTime: number = -1
) => {
  const user = await users.api.getUserById(payload.userId);
  const generatedFileName = `${
    Math.random().toString(18).substring(-2).split(".")[1]
  }.${file.name.split(".").pop()}`;

  const upload = await supabase()
    .storage.from(user.name)
    .upload(generatedFileName, file);

  if (upload.error) {
    return {
      data: null,
      error: upload.error,
    };
  }

  await db.insert(uploadTable).values({
    ...payload,
    generatedFileName,
    expiresAt:
      expirationTime <= -1
        ? null
        : new Date(Date.now() + expirationTime * 60000),
  });

  return {
    data: {
      name: `${process.env.NEXT_PUBLIC_SERVER_URL}/${generatedFileName}`,
    },
    error: null,
  };
};

type UserUploadsResponse =
  | {
      data: UploadItem[];
      error: null;
    }
  | { data: null; error: any };

const getUserUploads = async (): Promise<UserUploadsResponse> => {
  const { data, error } = await token.api.readToken();

  if (error || !data) {
    return {
      data: null,
      error,
    };
  }

  const userId = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.name, data.name));

  const list = await db
    .select()
    .from(uploadTable)
    .where(eq(uploadTable.userId, userId[0].id))
    .orderBy(desc(uploadTable.id))
    .execute();

  if (list.length == 0) {
    return {
      data: [],
      error: null,
    };
  }

  const result = await Promise.all(
    list.map(async (item) => {
      const fileData = await storage.api.getStorageItemByFileName(
        data.name,
        item.generatedFileName
      );

      return {
        ...fileData.data?.[0],
        ...item,
      };
    })
  );

  return {
    data: result,
    error: null,
  };
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
  const { data, error } = await token.api.readToken();

  if (error || !data) {
    return {
      error,
    };
  }

  await storage.api.clearBucket(data.name);
  await db.delete(uploadTable).where(eq(uploadTable.userId, 1));

  return {
    message: "All uploads have been deleted",
  };
};

const deleteUserUpload = async (bucketName: string, fileName: string) => {
  const exists = await db
    .select()
    .from(uploadTable)
    .where(eq(uploadTable.generatedFileName, fileName));

  if (exists.length == 0) {
    return {
      error: {
        message: "This upload does not exist",
      },
    };
  }

  await db
    .delete(uploadTable)
    .where(eq(uploadTable.generatedFileName, fileName));

  const { error } = await storage.api.deleteFileFromBucket(
    bucketName,
    fileName
  );

  if (error) {
    return {
      error: {
        message: error.message,
      },
    };
  }

  return {
    message: "Upload has been deleted",
    error: null,
  };
};

const getUploadBucketName = async (fileName: string) => {
  const exists = await db
    .select()
    .from(uploadTable)
    .where(eq(uploadTable.generatedFileName, fileName));

  if (exists.length == 0) {
    return {
      error: {
        message: "This upload does not exist",
      },
    };
  }

  const uploadCreator = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, exists[0].userId));

  return {
    data: uploadCreator[0].name,
  };
};

const getExpiredUploads = () => {
  return db
    .select()
    .from(uploadTable)
    .where(lt(uploadTable.expiresAt, new Date()));
};

const removeExpiredUploads = async () => {
  const uploads = await getExpiredUploads();

  console.log(`removeExpiredUploads: ${uploads.length} to delete.`);

  uploads.forEach(async (upload) => {
    const bucketName = await getUploadBucketName(upload.generatedFileName);

    if (bucketName.data) {
      await deleteUserUpload(bucketName.data, upload.generatedFileName);
    }
  });

  return {
    data: "Expired uploads have been deleted",
    error: null,
  };
};

export const uploads = {
  api: {
    createUpload,
    clearUserUploads,
    getUploadByName,
    getUserUploads,
    deleteUserUpload,
    getUploadBucketName,
    getExpiredUploads,
    removeExpiredUploads,
  },
};
