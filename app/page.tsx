import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { users } from "@/features/users/db/users";
import { LoginForm } from "@/features/users/ui/login-form";

export default async function Page() {
  const data = await users.api.getUsers();
  return (
    <main className="mx-auto flex flex-col items-center justify-center h-screen gap-1.5 max-w-xl px-2">
      {/* <Button size="sm">
        <Plus />
        Something
      </Button>
      <p className="text-xs">{JSON.stringify(data)}</p> */}
      <LoginForm />
    </main>
  );
}
