"use client";

import { useEffect } from "react";
import { UploadAlertDialog } from "@/features/uploads/components/upload-alert-dialog";

import { useGlobalDragHook } from "@/hooks/use-global-drag-hook";

export const FileHoverProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setIsDragging, setShiftDown } = useGlobalDragHook();
  useEffect(() => {
    window.addEventListener("dragenter", () => {
      setIsDragging(true);
    });
    window.addEventListener("dragleave", () => {
      setIsDragging(false);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Shift") {
        setShiftDown(true);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "Shift") {
        setShiftDown(false);
      }
    });

    return () => {
      window.removeEventListener("dragenter", () => {
        setIsDragging(true);
      });
      window.removeEventListener("dragleave", () => {
        setIsDragging(false);
      });
    };
  }, []);
  return (
    <>
      <UploadAlertDialog withTrigger={false} withTooltip={false} />
      {children}
    </>
  );
};
