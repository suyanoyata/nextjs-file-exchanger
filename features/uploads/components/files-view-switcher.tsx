"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteUploadsDialog } from "@/features/uploads/components/delete-uploads-dialog";
import { Grid2X2, List } from "lucide-react";
import { useEffect } from "react";

export const FilesViewSwitcher = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (localStorage.getItem("lastSelectedView") == null) {
      localStorage.setItem("lastSelectedView", "list");
    }
  }, []);

  if (typeof window === "undefined") return;

  return (
    <Tabs
      onValueChange={(value) => {
        localStorage.setItem("lastSelectedView", value);
      }}
      defaultValue={
        (localStorage.getItem("lastSelectedView") as string) ?? "list"
      }
      className="w-full"
    >
      <div className="flex flex-row justify-between items-center">
        <TabsList>
          <TabsTrigger value="grid">
            <Grid2X2 size={16} />
            Grid
          </TabsTrigger>
          <TabsTrigger value="list">
            <List size={16} />
            List
          </TabsTrigger>
        </TabsList>
        <DeleteUploadsDialog />
      </div>
      {children}
    </Tabs>
  );
};
