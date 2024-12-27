"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";

import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { FilesViewSwitcher } from "@/features/uploads/components/files-view-switcher";
import { UploadAlertDialog } from "@/features/uploads/components/upload-alert-dialog";
import { FilesListView } from "@/features/uploads/components/files-list-view";
import { FilesGridView } from "@/features/uploads/components/files-grid-view";

import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

import { motion } from "framer-motion";

export const UserUploads = () => {
  const { data: userUploads, isError } = useSuspenseQuery({
    queryKey: ["uploads"],
    queryFn: async () =>
      await api.get("/api/uploads").then((res) => res.data.data),
  });

  if (userUploads?.length == 0 || (userUploads == null && !isError)) {
    return (
      <main className="flex-1 items-center justify-center flex flex-col h-screen gap-1.5">
        <p className="text-sm">You don't have any uploads yet</p>
        <UploadAlertDialog withTooltip={false} />
      </main>
    );
  }

  if (isError) {
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

  if (userUploads) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-2 flex flex-row justify-between flex-1"
      >
        <FilesViewSwitcher>
          <TabsContent value="grid">
            <FilesGridView uploads={userUploads.data} />
          </TabsContent>
          <TabsContent value="list">
            <FilesListView uploads={userUploads.data} />
          </TabsContent>
        </FilesViewSwitcher>
      </motion.div>
    );
  }
};
