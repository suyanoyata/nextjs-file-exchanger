"use client";

import { analytics } from "@/lib/posthog";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export const AnalyticsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    analytics;
  }, []);
  return <PostHogProvider client={analytics}>{children}</PostHogProvider>;
};
