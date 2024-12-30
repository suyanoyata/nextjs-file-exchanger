import { SelectExpirationTime } from "@/features/settings/components/select-expiration-time";
import { LogOut } from "@/features/settings/components/logout";

export const Settings = () => {
  return (
    <div className="space-y-1.5 inline-flex flex-col w-full">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="h-[1px] bg-zinc-100 dark:bg-zinc-900 w-full" />
      <h2 className="text-2xl font-bold">Uploads</h2>
      <SelectExpirationTime />
      <div className="h-[1px] bg-zinc-100 dark:bg-zinc-900 w-full" />
      <h2 className="text-2xl font-bold">Account</h2>
      <LogOut />
    </div>
  );
};
