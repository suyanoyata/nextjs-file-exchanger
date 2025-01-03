"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { useGlobalDragHook } from "@/hooks/use-global-drag-hook";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileUploader } from "@/features/uploads/components/file-uploader";
import KeyDisplay from "@/components/ui/key-display";

import { handleUpload } from "@/features/uploads/lib/handle-upload";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

import { User } from "@/features/users/types/users";

type UploadDialogProps = {
  withTooltip?: boolean;
  withTrigger?: boolean;
};

export const UploadAlertDialog = ({
  withTooltip = true,
  withTrigger = true,
}: UploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isPermanent, setIsPermanent] = useState(false);

  // isAlertOpen to check if other alerts are open,
  // if they are we don't create a new alert for drag'n'drop
  const { isDragging, isShiftDown, isAlertOpen, setIsAlertOpen } =
    useGlobalDragHook();

  const { data } = useQuery<User>({
    queryKey: ["current-user"],
    queryFn: async () => (await api.get("/api/user")).data.data,
  });

  const sidebar = useSidebar();

  const { mutate, isPending } = useMutation({
    mutationKey: ["upload-file"],
    mutationFn: async (files: File[]) => {
      await handleUpload(files, isPermanent ? -1 : data?.expirationMinutes);
      await queryClient.invalidateQueries({
        queryKey: ["uploads"],
      });
    },
    onSuccess: () => {
      sidebar.setOpenMobile(false);
      setOpen(false);
    },
  });

  useEffect(() => {
    if (isPending) return;

    if (data && data?.expirationMinutes > -1 == false) {
      setIsPermanent(true);
      return;
    }

    setIsPermanent(isShiftDown);
  }, [isPending, isShiftDown, data]);

  useEffect(() => {
    if (!isAlertOpen && isDragging && !withTrigger) {
      setOpen(true);
    }
  }, [isDragging]);

  useEffect(() => {
    if (!isAlertOpen && open) {
      setIsAlertOpen(true);
    }

    if (isAlertOpen && !open) {
      setIsAlertOpen(false);
    }
  }, [open]);

  const formattedTime = data
    ? data?.expirationMinutes >= 60
      ? `approximately in ${Math.round(data?.expirationMinutes / 60)} hours`
      : `in ${data?.expirationMinutes} minutes`
    : "5 minutes";

  const queryClient = useQueryClient();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {withTrigger && (
        <AlertDialogTrigger asChild>
          <SidebarMenuButton
            className="w-auto"
            tooltip={withTooltip ? "New Upload" : undefined}
          >
            <Plus />
            <span>New Upload</span>
          </SidebarMenuButton>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <VisuallyHidden>
          <AlertDialogTitle>Upload a file</AlertDialogTitle>
        </VisuallyHidden>
        <FileUploader
          // @ts-ignore
          accept={["*"]}
          maxSize={1024 * 1024 * 50}
          onValueChange={async (files) => {
            mutate(files);
          }}
        />
        {data && data?.expirationMinutes > -1 && (
          <div className="text-xs text-zinc-500 font-medium select-none">
            Pro Tip: Hold <KeyDisplay>Shift</KeyDisplay> to permanently upload
            file.
          </div>
        )}
        <AlertDialogFooter className="flex-row flex justify-end items-center gap-2 self-start select-none">
          <p
            className={cn(
              "text-zinc-400 text-xs font-medium h-4 flex-1",
              isPermanent && "text-red-500"
            )}
          >
            {!isPermanent && `This upload will be deleted ${formattedTime}`}
            {isPermanent && "This upload will not be deleted"}
          </p>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
