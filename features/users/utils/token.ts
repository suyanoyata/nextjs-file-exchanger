"server-only";

import { User } from "@/features/users/types/users";
import { JWTVerifyResult, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

class TokenService {
  public signToken = async (payload: User) => {
    const secret = new TextEncoder().encode(process.env.SUPABASE_SECRET!);

    return await new SignJWT({
      name: payload.name,
      userId: payload.id,
    })
      .setExpirationTime("2h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
  };

  public readToken = async () => {
    const cookie = (await cookies()).get("access-token");

    if (!cookie) {
      return {
        data: null,
        error: "no access-token",
      };
    }

    const token = cookie.value;

    const secret = new TextEncoder().encode(process.env.SUPABASE_SECRET!);
    try {
      const verifyToken: JWTVerifyResult<{
        userId: number;
        name: string;
      }> = await jwtVerify(token, secret);
      return {
        data: verifyToken.payload,
        error: null,
      };
    } catch (error: any) {
      switch (error.code) {
        case "ERR_JWT_EXPIRED": {
          return {
            data: null,
            error: {
              message: "Token expired",
            },
          };
        }
        default: {
          return {
            data: null,
            error: {
              message: error.code,
            },
          };
        }
      }
    }
  };

  public readCustomToken = async (token: string) => {
    const secret = new TextEncoder().encode(process.env.SUPABASE_SECRET!);
    try {
      const verifyToken: JWTVerifyResult<{
        userId: number;
        name: string;
      }> = await jwtVerify(token, secret);
      return {
        data: verifyToken.payload,
        error: null,
      };
    } catch (error: any) {
      switch (error.code) {
        case "ERR_JWT_EXPIRED": {
          return {
            data: null,
            error: {
              message: "Token expired",
            },
          };
        }
        default: {
          return {
            data: null,
            error: {
              message: error.code,
            },
          };
        }
      }
    }
  };
}

export default new TokenService();
