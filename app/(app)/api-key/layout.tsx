import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "File Sharing - API Key",
  description: "Platform to quickly share your files",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
