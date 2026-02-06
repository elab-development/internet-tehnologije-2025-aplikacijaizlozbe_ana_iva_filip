import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";

export async function requireAuth() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) throw new Error("UNAUTHENTICATED");
  return verifyAuthToken(token); // { sub, email, imePrezime, rola }
}
