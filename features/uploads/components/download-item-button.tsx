"use client";

import { Button } from "@/components/ui/button";
import { UploadItem } from "@/features/uploads/types/uploads";
import { Download } from "lucide-react";
import Link from "next/link";

export const DownloadItemButton = ({
  upload,
  withText = false,
}: {
  upload: UploadItem;
  withText?: boolean;
}) => {
  return (
    <Link prefetch={false} href={`/${upload.name}?d=1`}>
      <Button>
        <Download />
        {withText && "Download"}
      </Button>
    </Link>
  );
};
