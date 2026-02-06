import { db } from "@/db";
import { korisnici } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Body = {
  imePrezime: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  const { imePrezime, email, password } = (await req.json()) as Body;

  // 2) Validate input
  if (!imePrezime || !email || !password) {
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }

  // 3) Email postoji?
  const exists = await db
    .select({ id: korisnici.korisnikId })
    .from(korisnici)
    .where(eq(korisnici.email, email));

  if (exists.length) {
    return NextResponse.json({ error: "Email postoji u bazi" }, { status: 400 });
  }

  // 4) Hash
  const passwordHash = await bcrypt.hash(password, 10);

  // 5) Create user (rola default USER)
  const [u] = await db
    .insert(korisnici)
    .values({
      rola: "USER",
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

  // 6) Sign JWT
  const token = signAuthToken({
    sub: u.id,
    email: u.email,
    imePrezime: u.imePrezime,
    rola: u.rola as "USER" | "FOTOGRAF" | "ADMIN",
  });

  // 7) Set cookie
  const res = NextResponse.json(u);
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  return res;
}
