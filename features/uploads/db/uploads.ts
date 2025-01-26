"server-only";

import { desc, eq, lt } from "drizzle-orm";

import { supabase } from "@/lib/supabase";

import { db } from "@/db";
import { uploadTable } from "@/db/schema/uploads";
import { usersTable } from "@/db/schema/users";

import StorageService from "@/features/uploads/db/storage";

import { UploadCreatePayload, UploadItem } from "@/features/uploads/types/uploads";
import { token } from "@/features/users/utils/token";
import { users } from "@/features/users/db/users";

type UserUploadsResponse =
  | {
      data: UploadItem[];
      error: null;
    }
  | { data: null; error: any };

class UploadService {
  public createUpload = async (
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
        expirationTime <= -1 ? null : new Date(Date.now() + expirationTime * 60000),
    });

    return {
      data: {
        name: `${process.env.NEXT_PUBLIC_SERVER_URL}/${generatedFileName}`,
      },
      error: null,
    };
  };

  public getUserUploads = async (): Promise<UserUploadsResponse> => {
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
        const fileData = await StorageService.getStorageItemByFileName(
          data.name,
          item.generatedFileName
        );

        return {
          ...fileData.data?.[0],
          name: fileData.data?.[0].name ?? item.generatedFileName,
          ...item,
        };
      })
    );

    return {
      data: result,
      error: null,
    };
  };

  public clearUserUploads = async () => {
    const { data, error } = await token.api.readToken();

    if (error || !data) {
      return {
        error,
      };
    }

    await StorageService.clearBucket(data.name);
    await db.delete(uploadTable).where(eq(uploadTable.userId, 1));

    return {
      message: "All uploads have been deleted",
    };
  };

  public deleteUserUpload = async (bucketName: string, fileName: string) => {
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

    await db.delete(uploadTable).where(eq(uploadTable.generatedFileName, fileName));

    const { error } = await StorageService.deleteFileFromBucket(bucketName, fileName);

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

  public getUploadBucketName = async (fileName: string) => {
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

  private getUploadData = async (name: string) => {
    const { data, error } = await token.api.readToken();

    if (error || !data) {
      return null;
    }

    const user = await db.select().from(usersTable).where(eq(usersTable.name, data.name));
    const items = await db
      .select()
      .from(uploadTable)
      .where(eq(uploadTable.generatedFileName, name));

    const fileData = await StorageService.getStorageItemByFileName(
      user[0].name,
      items[0].generatedFileName
    );

    if (items.length == 0 || fileData.error) {
      return null;
    }

    return {
      ...fileData.data[0],
      ...items[0],
      name: fileData.data[0].name ?? items[0].generatedFileName,
    };
  };

  private isFileOwner = async (fileName: string): Promise<boolean> => {
    const { data, error } = await token.api.readToken();

    if (error || !data) {
      return false;
    }

    const exists = await db
      .select()
      .from(uploadTable)
      .where(eq(uploadTable.generatedFileName, fileName));

    if (exists.length == 0) {
      return false;
    }

    return exists[0].userId == data.userId;
  };

  private getExpiredUploads = () => {
    return db.select().from(uploadTable).where(lt(uploadTable.expiresAt, new Date()));
  };

  public removeExpiredUploads = async () => {
    const uploads = await this.getExpiredUploads();

    if (uploads.length != 0) {
      console.log(`removeExpiredUploads: ${uploads.length} to delete.`);
    }

    uploads.forEach(async (upload) => {
      const bucketName = await this.getUploadBucketName(upload.generatedFileName);

      if (bucketName.data) {
        await this.deleteUserUpload(bucketName.data, upload.generatedFileName);
      }
    });

    return {
      data: "Expired uploads have been deleted",
      error: null,
    };
  };

  public changeUploadExpirationTime = async (
    uploadName: string,
    expirationMinutes: number,
    fromCurrentTime: boolean
  ) => {
    // #region check if user is owner of file
    if ((await this.isFileOwner(uploadName)) == false) {
      return {
        data: null,
        error: {
          message: "You are not the owner of this file",
        },
      };
    }
    // #endregion

    const upload = await this.getUploadData(uploadName);

    if (upload == null) {
      return upload;
    }

    if (expirationMinutes <= 0) {
      await db
        .update(uploadTable)
        .set({
          expiresAt: null,
        })
        .where(eq(uploadTable.generatedFileName, uploadName))
        .execute()
        .catch(() => {
          return {
            data: null,
            error: {
              message: "Couldn't update expiration time",
            },
          };
        });

      return await this.getUploadData(uploadName);
    }

    const startTime =
      fromCurrentTime || upload?.expiresAt == null
        ? Date.now()
        : new Date(upload.created_at).getTime();

    const expiresAt = new Date(startTime + expirationMinutes * 60000);

    await db
      .update(uploadTable)
      .set({ expiresAt })
      .where(eq(uploadTable.generatedFileName, uploadName))
      .catch(() => {
        return {
          data: null,
          error: {
            message: "Couldn't update expiration time",
          },
        };
      });

    return this.getUploadData(uploadName);
  };
}

export default new UploadService();
