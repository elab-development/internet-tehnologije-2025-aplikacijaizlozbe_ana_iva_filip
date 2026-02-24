import { db } from "@/db";
import { korisnici } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/csrf";


type Body = {
  email: string;
  password: string;
};

/**
 *  @openapi
 *  /api/auth/login:
 *    post:
 *      summary: Login korisnika
 *      description: Omogućava korisniku da se prijavi na sistem.
 *      responses:
 *        200:
 *          description: Uspešna prijava
 *        401:
 *          description: Pogrešan email ili lozinka
 */
export async function POST(req: NextRequest) {
   try {
    // CSRF zaštita: dozvoljavamo POST samo sa našeg origin-a
    assertSameOrigin(req);
  } catch {
    return NextResponse.json({ error: "CSRF_BLOCKED" }, { status: 403 });
  }
  const { email, password } = (await req.json()) as Body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Pogrešan email ili lozinka" },
      { status: 401 }
    );
  }

  const [u] = await db
    .select()
    .from(korisnici)
    .where(eq(korisnici.email, email));

  if (!u) {
    return NextResponse.json(
      { error: "Pogrešan email ili lozinka" },
      { status: 401 }
    );
  }

  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "Pogrešan email ili lozinka" },
      { status: 401 }
    );
  }

  const token = signAuthToken({
    sub: u.korisnikId,
    email: u.email,
    imePrezime: u.imePrezime,
    rola: u.rola as "USER" | "FOTOGRAF" | "ADMIN", //castovali
  });

  const res = NextResponse.json({
    id: u.korisnikId,
    imePrezime: u.imePrezime,
    email: u.email,
    rola: u.rola,
  });

  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  return res;
}
