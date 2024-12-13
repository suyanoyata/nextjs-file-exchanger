"use client";

import { KeyRoundIcon, Settings, UploadIcon } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import { UploadAlertDialog } from "@/features/uploads/components/upload-alert-dialog";

import { usePathname } from "next/navigation";

type SidebarItemType = {
  title: string;
  icon: React.ReactNode;
  href: string;
};

const sidebarItems: SidebarItemType[][] = [
  [
    {
      title: "My uploads",
      icon: <UploadIcon />,
      href: "/uploads",
    },
  ],
  [
    {
      title: "API key",
      icon: <KeyRoundIcon />,
      href: "/api-key",
    },
  ],
];

export const AppSidebar = () => {
  const pathname = usePathname();
  const sidebar = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup className="gap-1.5">
          <UploadAlertDialog />
          {sidebarItems.map((section, index) => (
            <section className="space-y-1.5" key={index}>
              {section.map((item, index) => (
                <SidebarMenuButton
                  onClick={() => sidebar.setOpenMobile(false)}
                  tooltip={item.title}
                  key={index}
                  asChild
                  variant={pathname == item.href ? "sidebar-focus" : "sidebar"}
                >
                  <Link className="w-full" href={item.href}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              ))}
              {index + 1 !== sidebarItems.length && <SidebarSeparator />}
            </section>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton
          tooltip="Settings"
          asChild
          variant={pathname == "/settings" ? "sidebar-focus" : "sidebar"}
        >
          <Link className="w-full" href="/settings">
            <Settings />
            <span>Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
