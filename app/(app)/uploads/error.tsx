"use client";

import { useEffect } from "react";

export default function Error({
  error,
}: // reset,
{
  error: Error & { digest?: string };
  // reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <h2 className="text-sm font-medium">
        Couldn't get your uploads. Try again later.
      </h2>
    </div>
  );
}
