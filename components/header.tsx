"use server";

import { users } from "@/features/users/db/users";

export const Header = async () => {
  const user = await users.api.getCurrentUser();
  return <header>{JSON.stringify(user)}</header>;
};
