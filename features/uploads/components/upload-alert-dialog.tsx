"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

import { FileUploader } from "@/features/uploads/components/file-uploader";

import { handleUpload } from "@/features/uploads/lib/handle-upload";

type UploadDialogProps = {
  withTooltip?: boolean;
};

export const UploadAlertDialog = ({
  withTooltip = true,
}: UploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const sidebar = useSidebar();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <SidebarMenuButton
          className="w-auto"
          tooltip={withTooltip ? "New Upload" : undefined}
        >
          <Plus />
          <span>New Upload</span>
        </SidebarMenuButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <VisuallyHidden>
          <AlertDialogTitle>Upload a file</AlertDialogTitle>
        </VisuallyHidden>
        <FileUploader
          // @ts-ignore
          accept={["*"]}
          maxSize={1024 * 1024 * 50}
          onValueChange={(files) => {
            handleUpload(files).then(() => {
              sidebar.setOpenMobile(false);
              setOpen(false);
            });
          }}
        />
        <div className="flex-row flex justify-end gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
