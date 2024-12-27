import { Fira_Code } from "next/font/google";
import { users } from "@/features/users/db/users";
import { cn } from "@/lib/utils";

const firaCode = Fira_Code({ subsets: ["latin"], weight: ["400", "500"] });

export default async function Page() {
  const user = await users.api.getCurrentUser();

  if (user.error || !user.data) {
    return (
      <div className="w-full flex h-screen items-center justify-center">
        <p className="text-sm">Something went wrong</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold">API Key</h1>
      <p>
        This is your upload token, you can use this to quickly upload files.
      </p>
      <p
        className={cn(
          "text-sm break-words bg-zinc-200/40 outline-zinc-200/20 dark:bg-zinc-800/40 rounded-lg outline outline-1 dark:outline-zinc-400/20 p-3",
          firaCode.className
        )}
      >
        {user.data.apiKey}
      </p>
      <p>Example of usage with curl:</p>
      <p
        className={cn(
          "text-sm break-words bg-zinc-200/40 outline-zinc-200/20 dark:bg-zinc-800/40 rounded-lg outline outline-1 dark:outline-zinc-400/20 p-3",
          firaCode.className
        )}
      >
        {`curl -X POST "http://localhost:3000/api/upload" -F "file=@/path/to/your/file.txt" -F "uploadToken=${user.data.apiKey}"`}
      </p>
      <p>
        Uploads through the API are inheriting expire property from your
        settings.
      </p>
    </>
  );
}
