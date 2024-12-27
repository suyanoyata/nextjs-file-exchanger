import { LoginForm } from "@/features/users/ui/login-form";

export default async function Page() {
  return (
    <main className="mx-auto inline-flex flex-col items-center justify-center h-screen gap-1.5 max-w-lg px-2 flex-1">
      <LoginForm />
    </main>
  );
}
