"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { Download, File, Music, Trash2, Video } from "lucide-react";

import { Button } from "@/components/ui/button";

import { UploadItem } from "@/features/uploads/types/uploads";

const Icon = ({ upload }: { upload: UploadItem }) => {
  if (upload.metadata?.mimetype.startsWith("image/")) {
    return (
      <Image
        alt={upload.name ?? upload.generatedFileName}
        src={upload.url}
        width={36}
        height={36}
        className="rounded-lg object-cover h-[36px] w-[36px]"
      />
    );
  }

  // if (upload.metadata?.mimetype.startsWith("video/")) {
  //   return <Video size={36} />;
  // }

  // if (upload.metadata?.mimetype.startsWith("audio/")) {
  //   return <Music size={36} />;
  // }

  return <File size={36} />;
};

export const FilesListView = ({ uploads }: { uploads: UploadItem[] }) => {
  const queryClient = useQueryClient();
  const { data } = useQuery<UploadItem[]>({
    queryKey: ["uploads"],
    queryFn: async () => axios.get("/api/uploads").then((res) => res.data.data),
    initialData: uploads,
  });

  const { mutate: deleteUpload } = useMutation({
    mutationKey: ["deleteUpload"],
    mutationFn: async (name: string) => axios.delete(`/api/uploads/${name}`),
    onMutate: (name: string) => {
      queryClient.setQueryData(["uploads"], (prev: UploadItem[]) => {
        return prev.filter((upload) => upload.name !== name);
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["uploads"],
      }),
  });

  return (
    <div className="space-y-2">
      {data.map((upload) => (
        <div
          key={upload.id}
          className="flex flex-row items-center hover:bg-zinc-800/20 rounded-lg duration-200 relative"
        >
          <Link href={`/${upload.name}`} className="p-2 flex-1 flex gap-2">
            <Icon upload={upload} />
            <div>
              <p className="text-sm font-medium">{upload.originalFileName}</p>
              <p className="text-xs text-zinc-500 font-medium">{upload.name}</p>
            </div>
          </Link>
          <Link
            className="absolute right-16"
            href={`/api/download/${upload.name}`}
          >
            <Button>
              <Download />
            </Button>
          </Link>
          <Button
            className="absolute right-2"
            onClick={() =>
              deleteUpload(upload.name ?? upload.generatedFileName)
            }
            variant="destructive"
          >
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  );
};
