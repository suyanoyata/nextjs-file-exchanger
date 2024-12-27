"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const LogOut = () => {
  const router = useRouter();
  const handleClick = () => {
    document.cookie =
      "access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    router.push("/");
  };

  return (
    <Button onClick={handleClick} variant="destructive">
      <LogOutIcon />
      Logout
    </Button>
  );
};
