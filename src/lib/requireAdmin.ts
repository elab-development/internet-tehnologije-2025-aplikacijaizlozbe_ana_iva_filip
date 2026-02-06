import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";

export async function requireAdmin() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) throw new Error("UNAUTHENTICATED");

  const claims = verifyAuthToken(token);
  if (claims.rola !== "ADMIN") throw new Error("FORBIDDEN");

  return claims; // ako zatreba kasnije
}
