import type { Metadata } from "next";
import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

import ClientProviders from "@/providers/query-client-provider";
// import { AnalyticsProvider } from "@/providers/posthog-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "File Sharing",
  description: "Platform to quickly share your files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`overscroll-none antialiased font-sans dark:bg-[#0c0e11] min-w-[320px]`}
      >
        <ThemeProvider
          attribute="class"
          // defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* <AnalyticsProvider> */}
          <ClientProviders>
            <SidebarProvider defaultOpen={false}>
              <main className="flex-1 flex flex-row">{children}</main>
            </SidebarProvider>
          </ClientProviders>
          {/* </AnalyticsProvider> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
