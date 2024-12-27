import React from "react";

const KeyDisplay = ({ children }: { children: string }) => {
  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-xs text-zinc-500 dark:text-zinc-400">
      {children}
    </span>
  );
};

export default KeyDisplay;
