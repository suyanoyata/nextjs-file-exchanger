"use client";

import { Button } from "@/components/ui/button";
import { UploadItem } from "@/features/uploads/types/uploads";
import axios from "axios";
import { Download } from "lucide-react";

export const DownloadItemButton = ({ upload }: { upload: UploadItem }) => {
  return (
    <Button
      onClick={async () => await axios.get(`/api/download/${upload.name}`)}
    >
      <Download />
    </Button>
  );
};
