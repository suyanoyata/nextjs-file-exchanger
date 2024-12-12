"use server";

import { users } from "@/features/users/db/users";

export const Header = async () => {
  const user = await users.api.getCurrentUser({ userId: 1 });
  return <header>{user.email}</header>;
};
