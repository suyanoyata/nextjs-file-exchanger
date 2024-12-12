"use server";

import { TabsContent } from "@/components/ui/tabs";

import { uploads } from "@/features/uploads/db/uploads";

import { FilesViewSwitcher } from "@/features/uploads/components/files-view-switcher";
import { UploadAlertDialog } from "@/features/uploads/components/upload-alert-dialog";
import { FilesListView } from "@/features/uploads/components/files-list-view";
import { UploadItem } from "@/features/uploads/types/uploads";

export const UserUploads = async () => {
  const userUploads: UploadItem[] = await uploads.api.getUserUploads();

  if (userUploads.length == 0) {
    return (
      <main className="flex-1 items-center justify-center flex flex-col h-screen gap-1.5">
        <p className="text-sm">You don't have any uploads yet</p>
        <UploadAlertDialog withTooltip={false} />
      </main>
    );
  }

  return (
    <div className="p-2 flex flex-row justify-between">
      <FilesViewSwitcher>
        <TabsContent value="grid">Grid View</TabsContent>
        <TabsContent value="list">
          <FilesListView uploads={userUploads} />
        </TabsContent>
      </FilesViewSwitcher>
    </div>
  );
};
