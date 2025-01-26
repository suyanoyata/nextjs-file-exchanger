"server-only";

import { supabase } from "@/lib/supabase";

class StorageService {
  public getStorageItemByFileName = async (bucketName: string, fileName: string) => {
    console.log(await supabase().storage.from(bucketName).list("test-folder"));
    return await supabase().storage.from(bucketName).list("", {
      search: fileName,
      limit: 1,
    });
  };

  public getFilePublicUrl = (bucketName: string, fileName: string) => {
    const url = supabase().storage.from(bucketName).getPublicUrl(fileName);

    if (url.data.publicUrl) {
      return url.data.publicUrl;
    } else {
      throw new Error("Unable to get public url for this upload");
    }
  };

  public clearBucket = async (bucketName: string) => {
    return await supabase().storage.emptyBucket(bucketName);
  };

  public downloadFile = async (bucketName: string, fileName: string) => {
    const file = await supabase().storage.from(bucketName).download(fileName);
    return file;
  };

  public deleteFileFromBucket = async (bucketName: string, fileName: string) => {
    return await supabase().storage.from(bucketName).remove([fileName]);
  };
}

export default new StorageService();
