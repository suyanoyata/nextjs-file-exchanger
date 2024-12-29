"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { File, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { UploadItem } from "@/features/uploads/types/uploads";
import { ExpirableItem } from "@/features/uploads/components/expirable-item";
import { DownloadItemButton } from "@/features/uploads/components/download-item-button";

import { clientUploads } from "@/features/uploads/api/uploads";

const Icon = ({ upload }: { upload: UploadItem }) => {
  if (upload.metadata?.mimetype.startsWith("image/")) {
    return (
      <Image
        alt={upload.name ?? upload.generatedFileName}
        src={`/${upload.name}`}
        width={64}
        height={64}
        className="rounded-lg object-cover h-[64px] w-[64px]"
      />
    );
  }

  return <File className="text-zinc-600 dark:text-foreground" size={64} />;
};

export const FilesGridView = ({ uploads }: { uploads: UploadItem[] }) => {
  const queryClient = useQueryClient();

  const { data } = clientUploads.api.getUploads(uploads);
  const { mutate: deleteUpload, isPending } =
    clientUploads.api.deleteUpload(queryClient);

  return (
    <div className="w-full grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((upload) => (
        <Card
          key={upload.id}
          className="hover:bg-zinc-300/20 dark:hover:bg-zinc-800/20 rounded-lg duration-200 relative flex-1 min-w-64 flex flex-col"
        >
          <CardContent className="p-4 flex-1">
            <Link
              className="flex gap-2 overflow-hidden cursor-pointer flex-col"
              href={`/${upload.name}`}
            >
              <Icon upload={upload} />
              <div>
                <div className="inline-flex gap-1.5 items-center">
                  <p className="text-sm font-medium text-ellipsis overflow-hidden">
                    {upload.originalFileName}
                  </p>
                  <ExpirableItem date={upload.expiresAt} />
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                  {upload.name}
                </p>
              </div>
            </Link>
          </CardContent>
          <CardFooter>
            <div className="flex flex-row items-center gap-1.5">
              <DownloadItemButton
                disabled={isPending}
                withText
                upload={upload}
              />
              <Button
                disabled={isPending}
                onClick={() =>
                  deleteUpload(upload.name ?? upload.generatedFileName)
                }
                variant="destructive"
              >
                <Trash2 />
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
