import { LogOut } from "@/features/settings/components/logout";
import { SelectExpirationTime } from "@/features/settings/components/select-expiration-time";

export default function Page() {
  return (
    <div className="space-y-1.5 inline-flex flex-col">
      <h1 className="text-2xl font-bold">Settings</h1>
      <SelectExpirationTime />
      <LogOut />
    </div>
  );
}
