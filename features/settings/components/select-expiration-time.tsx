"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExpirationTime } from "@/features/settings/db/users";
import { cn } from "@/lib/utils";

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

export const SelectExpirationTime = () => {
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
        <Button>Change expiration time</Button>
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
