import { FileHoverProvider } from "@/providers/file-hover-provider";

import { AppSidebar } from "@/components/app-sidebar";
import type { Metadata } from "next";
// import { SidebarTrigger } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "File Sharing",
  description: "Platform to quickly share your files",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FileHoverProvider>
      <AppSidebar />
      {/* <SidebarTrigger /> */}
      <main className="flex-1 p-1.5 space-y-1.5 max-w-4xl mx-auto">
        {children}
      </main>
    </FileHoverProvider>
  );
}
