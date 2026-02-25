import { db } from "@/db";
import { korisnici } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/csrf";

type Body = {
  imePrezime: string;
  email: string;
  password: string;
  rola?: string;
};

/**
 *  @openapi
 *  /api/auth/register:
 *    post:
 *      summary: Registracija novog korisnika
 *      description: Omogućava posetiocu da kreira nalog na platformi za izložbe.
 *      responses:
 *        201:
 *          description: Korisnik uspešno kreiran.
 *        400:
 *          description: Loši podaci ili korisnik već postoji.
 */
export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req);
  } catch {
    return NextResponse.json({ error: "CSRF_BLOCKED" }, { status: 403 });
  }

  const { imePrezime, email, password, rola } = (await req.json()) as Body;

  if (!imePrezime || !email || !password) {
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }

  const exists = await db
    .select({ id: korisnici.korisnikId })
    .from(korisnici)
    .where(eq(korisnici.email, email));

  if (exists.length) {
    return NextResponse.json({ error: "Email postoji u bazi" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [u] = await db
    .insert(korisnici)
    .values({
      rola: rola || "USER",
      imePrezime,
      email,
      passwordHash,
    })
    .returning({
      id: korisnici.korisnikId,
      imePrezime: korisnici.imePrezime,
      email: korisnici.email,
      rola: korisnici.rola,
    });

  const token = signAuthToken({
    sub: u.id,
    email: u.email,
    imePrezime: u.imePrezime,
    rola: u.rola as "USER" | "FOTOGRAF" | "ADMIN",
  });

  const res = NextResponse.json(u);
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  return res;
}
