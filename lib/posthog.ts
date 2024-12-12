import { AnalyticsLogEventPayload } from "@/types/analytics";
import posthog from "posthog-js";

export const analytics = posthog.init(process.env.NEXT_PUBLIC_POSTHOG_TOKEN!, {
  api_host: "https://eu.i.posthog.com",
  person_profiles: "identified_only",
});

export const logEvent = (payload: AnalyticsLogEventPayload) => {
  return analytics?.capture(payload.eventName, payload.payload);
};
