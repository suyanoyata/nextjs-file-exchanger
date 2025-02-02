"use client";

import Image from "next/image";
import Link from "next/link";

import { File, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { UploadItem } from "@/features/uploads/types/uploads";

import { ChangeFilePropertiesAlert } from "@/features/uploads/components/change-file-properties";
import { ExpirableIndicator } from "@/features/uploads/components/expirable-indicator";
import { DownloadItemButton } from "@/features/uploads/components/download-item-button";

import { useUploadsState } from "@/hooks/use-uploads-state";
import { useEffect, useRef, useState } from "react";

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
  const { isUploadsActionsDisabled } = useUploadsState();

  const { data } = clientUploads.api.getUploads(uploads);
  const { mutate: deleteUpload } = clientUploads.api.deleteUpload();

  const [small, setSmall] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      setSmall(cardRef.current.clientWidth <= 380);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (cardRef.current) {
        setSmall(cardRef.current.clientWidth <= 380);
      }
    });

    return () => window.removeEventListener("resize", () => {});
  }, [cardRef]);

  return (
    <div className="w-full grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((upload) => (
        <Card
          ref={cardRef}
          key={upload.id}
          className="hover:bg-zinc-300/20 dark:hover:bg-zinc-800/20 rounded-lg duration-200 relative flex-1 min-w-64 flex flex-col"
        >
          <CardContent className="p-4 flex-1">
            <Link
              target="_blank"
              className="flex gap-2 overflow-hidden cursor-pointer flex-col"
              href={`/${upload.name}`}
            >
              <Icon upload={upload} />
              <div>
                <div className="inline-flex gap-1.5 items-center">
                  <p className="text-sm font-medium text-ellipsis overflow-hidden">
                    {upload.originalFileName}
                  </p>
                  <ExpirableIndicator date={upload.expiresAt} />
                </div>
                <p className="text-xs text-zinc-500 font-medium">{upload.name}</p>
              </div>
            </Link>
          </CardContent>
          <CardFooter>
            <div className="flex flex-row items-center gap-1.5">
              <ChangeFilePropertiesAlert withText={!small} file={upload} />
              <DownloadItemButton withText={!small} upload={upload} />
              <Button
                disabled={isUploadsActionsDisabled}
                onClick={() => deleteUpload(upload.name ?? upload.generatedFileName)}
                variant="destructive"
              >
                <Trash2 />
                {!small && "Delete"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
