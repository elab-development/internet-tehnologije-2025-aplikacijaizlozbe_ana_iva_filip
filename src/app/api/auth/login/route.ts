import { db } from "@/db";
import { korisnici } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Body = {
  email: string;
  password: string;
};

export async function POST(req: Request) {
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
