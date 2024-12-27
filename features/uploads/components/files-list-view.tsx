"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { File, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DownloadItemButton } from "@/features/uploads/components/download-item-button";

import { clientUploads } from "@/features/uploads/api/uploads";

import { UploadItem } from "@/features/uploads/types/uploads";

const Icon = ({ upload }: { upload: UploadItem }) => {
  if (upload.metadata?.mimetype.startsWith("image/")) {
    return (
      <Image
        alt={upload.name ?? upload.generatedFileName}
        src={`/${upload.name}`}
        width={36}
        height={36}
        className="rounded-lg object-cover h-[36px] w-[36px]"
      />
    );
  }

  return <File className="text-zinc-600 dark:text-foreground" size={36} />;
};

export const FilesListView = ({ uploads }: { uploads: UploadItem[] }) => {
  const queryClient = useQueryClient();
  const { data } = clientUploads.api.getUploads(uploads);

  const { mutate: deleteUpload, isPending } =
    clientUploads.api.deleteUpload(queryClient);

  return (
    <div className="space-y-2 w-full">
      {data.map((upload) => (
        <div
          key={upload.id}
          className="flex flex-row items-center hover:bg-zinc-400/10 dark:hover:bg-zinc-800/20 rounded-lg duration-200 relative"
        >
          <Link
            prefetch={false}
            href={`/${upload.name}`}
            target="_blank"
            className="p-2 flex-1 flex gap-2"
          >
            <Icon upload={upload} />
            <div>
              <p className="text-sm font-medium">{upload.originalFileName}</p>
              <p className="text-xs text-zinc-500 font-medium">{upload.name}</p>
            </div>
          </Link>
          <div className="flex flex-row items-center gap-1.5">
            <DownloadItemButton disabled={isPending} upload={upload} />
            <Button
              disabled={isPending}
              onClick={() =>
                deleteUpload(upload.name ?? upload.generatedFileName)
              }
              variant="destructive"
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
