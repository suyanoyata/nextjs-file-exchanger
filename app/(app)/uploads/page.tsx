import { UserUploads } from "@/features/uploads/ui/user-uploads";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="relative">
      <Suspense
        fallback={
          <div className="absolute top-0 left-0 flex h-screen w-full items-center justify-center">
            <Loader size={18} className="animate-spin" />
          </div>
        }
      >
        <UserUploads />
      </Suspense>
    </div>
  );
}
