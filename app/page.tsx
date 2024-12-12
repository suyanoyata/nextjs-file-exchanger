import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { users } from "@/features/users/db/users";

export default async function Page() {
  const data = await users.api.getUsers();
  return (
    <main className="mx-4 py-2 flex flex-col items-center justify-center h-screen space-y-1.5">
      <Button size="sm">
        <Plus />
        Something
      </Button>
      <p className="text-xs">{JSON.stringify(data)}</p>
    </main>
  );
}
