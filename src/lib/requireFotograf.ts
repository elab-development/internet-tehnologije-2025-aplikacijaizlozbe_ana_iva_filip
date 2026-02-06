import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { db } from "@/db";
import { fotografi } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function requireFotograf() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) throw new Error("UNAUTHENTICATED");

  const claims = verifyAuthToken(token);
  if (claims.rola !== "FOTOGRAF" && claims.rola !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  const [f] = await db
    .select({ fotografId: fotografi.fotografId })
    .from(fotografi)
    .where(eq(fotografi.korisnikId, claims.sub));

  if (!f) throw new Error("NO_FOTOGRAF");

  return { fotografId: f.fotografId, claims };
}
