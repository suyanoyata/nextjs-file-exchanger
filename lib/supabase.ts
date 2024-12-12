"server-only";

import { createClient } from "@supabase/supabase-js";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.SUPABASE_SECRET!);

const token = await new SignJWT({
  sub: "1",
  role: "authenticated",
})
  .setProtectedHeader({ alg: "HS256" })
  .sign(secret);

export const supabase = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};
