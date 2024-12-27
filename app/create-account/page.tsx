import { RegisterForm } from "@/features/users/ui/register-form";

export default function Page() {
  return (
    <main className="mx-auto inline-flex flex-col items-center justify-center h-screen gap-1.5 max-w-lg px-2 flex-1">
      <RegisterForm />
    </main>
  );
}
