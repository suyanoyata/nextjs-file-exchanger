import { FileHoverProvider } from "@/providers/file-hover-provider";

import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FileHoverProvider>
      <AppSidebar />
      <main className="flex-1 p-1.5 space-y-1.5 max-w-4xl mx-auto">
        {children}
      </main>
    </FileHoverProvider>
  );
}
