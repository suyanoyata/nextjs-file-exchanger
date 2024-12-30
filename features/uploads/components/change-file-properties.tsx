import { Settings } from "lucide-react";

import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { cn } from "@/lib/utils";

import { account } from "@/features/users/api/account";
import { UploadItem, UploadProperties } from "@/features/uploads/types/uploads";
import { clientUploads } from "@/features/uploads/api/uploads";
import { useUploadsState } from "@/hooks/use-uploads-state";

const timesOption = [
  {
    label: "5 minutes",
    value: 5,
  },
  {
    label: "10 minutes",
    value: 10,
  },
  {
    label: "30 minutes",
    value: 30,
  },
  {
    label: "1 hour",
    value: 60,
  },
  {
    label: "2 hours",
    value: 120,
  },
  {
    label: "Don't delete",
    value: -1,
  },
];

const ExpirationTimeDropdown = ({
  file,
  properties,
  setProperties,
}: {
  file: UploadItem;
  properties: UploadProperties;
  setProperties: (properties: UploadProperties) => void;
}) => {
  const DropdownTime = () => {
    if (!properties.expireAfterMinutes) return null;

    if (properties.expireAfterMinutes <= 0) {
      return "Don't delete";
    }

    if (properties.expireAfterMinutes >= 60) {
      return `${properties.expireAfterMinutes / 60} hours`;
    }

    return `${properties.expireAfterMinutes} minutes`;
  };

  return (
    <>
      <DropdownMenuTrigger className="text-zinc-500">
        <DropdownTime />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {timesOption.map((item) => {
          if (item.value == null && file.expiresAt == null) return null;

          return (
            <DropdownMenuItem
              className={cn(
                item.value <= 0 && "text-red-400 focus:text-red-400"
              )}
              onClick={() =>
                setProperties({
                  ...properties,
                  expireAfterMinutes: item.value,
                })
              }
              key={item.value}
            >
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </>
  );
};

export const ChangeFilePropertiesAlert = ({
  withText = true,
  file,
}: {
  file: UploadItem;
  withText?: boolean;
}) => {
  const { data } = account.api.getCurrentUser();

  const [open, setOpen] = useState(false);

  const [properties, setProperties] = useState<UploadProperties>({
    expireAfterMinutes: data?.expirationMinutes ?? 5,
    newExpireFromCurrentTime: true,
  });

  const { isUploadsActionsDisabled } = useUploadsState();

  const { mutate, isSuccess } = clientUploads.api.changeExpirationTime();

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  return (
    <DropdownMenu>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger disabled={isUploadsActionsDisabled} asChild>
          <Button>
            <Settings size={14} />
            {withText && "Change properties"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Change file properties</AlertDialogTitle>
          <div className="flex items-center justify-between text-sm">
            <Label htmlFor="expire-time-switch" className="cursor-pointer">
              Expires after
            </Label>
            <ExpirationTimeDropdown
              file={file}
              properties={properties}
              setProperties={setProperties}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Label htmlFor="expire-time-switch" className="cursor-pointer">
              Change expire time from current time
            </Label>
            <Switch
              disabled={file.expiresAt == null}
              id="expire-time-switch"
              checked={properties.newExpireFromCurrentTime}
              onCheckedChange={(checked) =>
                setProperties({
                  ...properties,
                  newExpireFromCurrentTime: checked,
                })
              }
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <Button onClick={() => mutate({ file, properties })}>Save</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
};
