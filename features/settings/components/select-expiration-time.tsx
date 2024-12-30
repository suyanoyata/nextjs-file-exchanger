"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { updateExpirationTime } from "@/features/settings/db/users";

import { User } from "@/features/users/types/users";

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
    value: -1,
  },
];

const SelectExpirationTimeDropdown = () => {
  const client = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["changeExpirationTime"],
    mutationFn: async (expiration: number) =>
      await updateExpirationTime(expiration),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["current-user"],
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isPending} asChild>
        <Button variant="outline">Change time</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {timesOption.map((item) => (
          <DropdownMenuItem
            className={cn(
              item.value == -1 && "text-red-400 focus:text-red-400"
            )}
            onClick={() => mutateAsync(item.value)}
            key={item.value}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const SelectExpirationTime = () => {
  const { data: userData } = useQuery<User>({
    queryKey: ["current-user"],
    queryFn: async () => (await api.get("/api/user")).data.data,
  });

  const formattedTime =
    userData && userData?.expirationMinutes >= 60
      ? `${Math.round(userData?.expirationMinutes / 60)} hours`
      : `${userData?.expirationMinutes} minutes`;

  const Description = () => {
    if (userData?.expirationMinutes == -1) {
      return (
        <h2 className="text-zinc-600 dark:text-zinc-400 text-xs font-medium">
          Files uploaded via website and API will be deleted after the selected
          time. Your files will not be deleted after upload.
        </h2>
      );
    } else {
      return (
        <h2 className="text-zinc-600 dark:text-zinc-400 text-xs font-medium">
          Files uploaded via website and API will be deleted after the selected
          time. Your files will be deleted after{" "}
          <span className="text-zinc-900 dark:text-zinc-200">
            {formattedTime}
          </span>
          .
        </h2>
      );
    }
  };

  return (
    <div className="flex items-center justify-between flex-1">
      <div>
        <h1 className="text-lg font-bold">Default deletion time</h1>
        <Description />
      </div>
      <SelectExpirationTimeDropdown />
    </div>
  );
};
