import { users } from "@/features/users/db/users";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await users.api.getCurrentUser();

  if (user == null) {
    await users.api.createUser({
      email: "alice@gmail.com",
      name: "Alice",
    });
  }
  return (
    <main className="p-2">
      <header>{JSON.stringify(user)}</header>
      <main>{children}</main>
    </main>
  );
}
