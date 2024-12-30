import { Settings } from "lucide-react";
import { useState } from "react";

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

import { UploadItem } from "@/features/uploads/types/uploads";

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
    label: "Dont delete",
    value: null,
  },
];

type UploadProperties = {
  expireAfterMinutes: number | null;
  newExpireFromCurrentTime: boolean;
};

const ExpirationTimeDropdown = ({
  file,
  properties,
  setProperties,
}: {
  file: UploadItem;
  properties: UploadProperties;
  setProperties: (properties: UploadProperties) => void;
}) => {
  return (
    <>
      <DropdownMenuTrigger disabled className="text-zinc-500">
        {properties.expireAfterMinutes} minutes
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {timesOption.map((item) => {
          if (item.value == null && file.expiresAt == null) return null;

          return (
            <DropdownMenuItem
              className={cn(
                item.value == null && "text-red-400 focus:text-red-400"
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
  const [properties, setProperties] = useState<UploadProperties>({
    expireAfterMinutes: 5,
    newExpireFromCurrentTime: true,
  });

  return (
    <DropdownMenu>
      <AlertDialog>
        <AlertDialogTrigger asChild>
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
              // TODO: re-enable this switch
              disabled={file.expiresAt == null || true}
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
            <Button disabled>Save</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
};
