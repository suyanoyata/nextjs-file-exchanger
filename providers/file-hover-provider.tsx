"use client";

import { useEffect } from "react";
import { useGlobalDragHook } from "@/hooks/use-global-drag-hook";

export const FileHoverProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setIsDragging } = useGlobalDragHook();
  useEffect(() => {
    window.addEventListener("dragenter", () => {
      setIsDragging(true);
    });
    window.addEventListener("dragleave", () => {
      setIsDragging(false);
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
  return <>{children}</>;
};
