import Image from "next/image";
import Link from "next/link";

import { Download, File } from "lucide-react";

import { UploadItem } from "@/features/uploads/types/uploads";
import { Button } from "@/components/ui/button";

const Icon = ({ upload }: { upload: UploadItem }) => {
  if (upload.metadata?.mimetype.startsWith("image/")) {
    return (
      <Image
        alt={upload.name ?? upload.generatedFileName}
        src={upload.url}
        width={36}
        height={36}
        className="rounded-lg object-cover min-h-[36px] min-w-[36px]"
      />
    );
  } else {
    return <File size={36} />;
  }
};

export const FilesListView = ({ uploads }: { uploads: UploadItem[] }) => {
  return (
    <div className="space-y-2">
      {uploads.map((upload) => (
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
            className="absolute right-2"
            href={`/api/download/${upload.name}`}
          >
            <Button>
              <Download />
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
};
