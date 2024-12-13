"use client";

import axios from "axios";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const DeleteUploadsDialog = () => {
  const [open, setOpen] = useState(false);

  const { mutate: deleteUploads } = useMutation({
    mutationKey: ["delete-uploads"],
    mutationFn: async () => await axios.delete("/api/uploads"),
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 />
          Delete everything
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <VisuallyHidden>
          <AlertDialogTitle>Upload a file</AlertDialogTitle>
        </VisuallyHidden>
        <AlertDialogDescription>
          You're about to delete all your files. Are you sure about this?
        </AlertDialogDescription>
        <div className="flex-row flex justify-end gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={() => deleteUploads()}>
            Delete
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
