"server-only";

import { supabase } from "@/lib/supabase";

const getStorageItemByFileName = async (
  bucketName: string,
  fileName: string
) => {
  return await supabase().storage.from(bucketName).list("", {
    search: fileName,
    limit: 1,
  });
};

const getFilePublicUrl = (bucketName: string, fileName: string) => {
  const url = supabase().storage.from(bucketName).getPublicUrl(fileName);

  if (url.data.publicUrl) {
    return url.data.publicUrl;
  } else {
    throw new Error("Unable to get public url for this upload");
  }
};

const clearBucket = async (bucketName: string) => {
  return await supabase().storage.emptyBucket(bucketName);
};

const downloadFile = async (bucketName: string, fileName: string) => {
  const file = await supabase().storage.from(bucketName).download(fileName);
  return file;
};

const deleteFileFromBucket = async (bucketName: string, fileName: string) => {
  return await supabase().storage.from(bucketName).remove([fileName]);
};

export const storage = {
  api: {
    getStorageItemByFileName,
    getFilePublicUrl,
    clearBucket,
    downloadFile,
    deleteFileFromBucket,
  },
};
