"use client";

import Link from "next/link";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useUploadsState } from "@/hooks/use-uploads-state";

import { UploadItem } from "@/features/uploads/types/uploads";

export const DownloadItemButton = ({
  upload,
  withText = false,
}: {
  upload: UploadItem;
  withText?: boolean;
}) => {
  const { isUploadsActionsDisabled } = useUploadsState();

  if (isUploadsActionsDisabled) {
    return (
      <Button disabled={isUploadsActionsDisabled}>
        <Download />
        {withText && "Download"}
      </Button>
    );
  }

  return (
    <Link prefetch={false} href={`/${upload.name}?d=1`}>
      <Button disabled={isUploadsActionsDisabled}>
        <Download />
        {withText && "Download"}
      </Button>
    </Link>
  );
};
