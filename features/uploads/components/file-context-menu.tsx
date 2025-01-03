import { clientUploads } from "@/features/uploads/api/uploads";

import Link from "next/link";
import { Download, Trash2 } from "lucide-react";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { ChangeFilePropertiesAlert } from "@/features/uploads/components/change-file-properties";

import { UploadItem } from "@/features/uploads/types/uploads";

import { useUploadsState } from "@/hooks/use-uploads-state";

export const FileContextMenu = ({
  children,
  file,
}: {
  children: React.ReactNode;
  file: UploadItem;
}) => {
  const { isUploadsActionsDisabled } = useUploadsState();

  const { mutate: deleteUpload } = clientUploads.api.deleteUpload();

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Link
            className="flex items-center gap-1.5"
            href={`/${file.name}?d=1`}
            prefetch={false}
          >
            <Download size={14} />
            Download
          </Link>
        </ContextMenuItem>
        <ChangeFilePropertiesAlert file={file} />
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => deleteUpload(file.name)}
          disabled={isUploadsActionsDisabled}
          className="text-sm gap-1.5 text-red-400 focus:text-red-400"
        >
          <Trash2 size={14} />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
