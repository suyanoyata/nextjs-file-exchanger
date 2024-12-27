import { LoginForm } from "@/features/users/ui/login-form";
import { token } from "@/features/users/utils/token";
import { redirect } from "next/navigation";

export default async function Page() {
  if ((await token.api.readToken()).data?.userId) {
    redirect("/uploads");
  }
  return (
    <main className="mx-auto inline-flex flex-col items-center justify-center h-screen gap-1.5 max-w-lg px-2 flex-1">
      <LoginForm />
    </main>
  );
}
