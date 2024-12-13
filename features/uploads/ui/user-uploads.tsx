"use server";

import { TabsContent } from "@/components/ui/tabs";

import { uploads } from "@/features/uploads/db/uploads";

import { FilesViewSwitcher } from "@/features/uploads/components/files-view-switcher";
import { UploadAlertDialog } from "@/features/uploads/components/upload-alert-dialog";
import { FilesListView } from "@/features/uploads/components/files-list-view";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { FilesGridView } from "@/features/uploads/components/files-grid-view";

export const UserUploads = async () => {
  const userUploads = await uploads.api.getUserUploads();

  if (
    userUploads.data?.length == 0 ||
    (userUploads.data == null && !userUploads.error)
  ) {
    return (
      <main className="flex-1 items-center justify-center flex flex-col h-screen gap-1.5">
        <p className="text-sm">You don't have any uploads yet</p>
        <UploadAlertDialog withTooltip={false} />
      </main>
    );
  }

  if (userUploads.error) {
    return (
      <div className="h-screen items-center justify-center flex flex-col gap-1.5">
        <p className="font-medium">You are not associated with any user</p>
        <Link href="/">
          <Button>
            <LogIn />
            Go to auth
          </Button>
        </Link>
      </div>
    );
  }

  if (userUploads.data) {
    return (
      <div className="p-2 flex flex-row justify-between flex-1">
        <FilesViewSwitcher>
          <TabsContent value="grid">
            <FilesGridView uploads={userUploads.data} />
          </TabsContent>
          <TabsContent value="list">
            <FilesListView uploads={userUploads.data} />
          </TabsContent>
        </FilesViewSwitcher>
      </div>
    );
  }
};
