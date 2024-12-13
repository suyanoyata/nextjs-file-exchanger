"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { auth } from "@/features/users/api/auth";
import { useState } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");

  const { mutate, isPending } = auth.api.login({
    email,
  });

  return (
    <div className="flex w-full gap-1.5 flex-col">
      <Input
        placeholder="Username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button onClick={() => mutate()} disabled={isPending}>
        Login
      </Button>
      {/* {JSON.stringify({ isPending, isSuccess })} */}
    </div>
  );
};
