export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnikIzlozba, izlozbe, korisnici } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    await requireAdmin();

    const rows = await db
      .select({
        registracijaId: korisnikIzlozba.registracijaId,
        datumRegistracije: korisnikIzlozba.datumRegistracije,
        korisnikId: korisnici.korisnikId,
        imePrezime: korisnici.imePrezime,
        email: korisnici.email,
        izlozbaId: izlozbe.izlozbaId,
        nazivIzlozbe: izlozbe.nazivIzlozbe,
      })
      .from(korisnikIzlozba)
      .innerJoin(korisnici, eq(korisnici.korisnikId, korisnikIzlozba.korisnikId))
      .innerJoin(izlozbe, eq(izlozbe.izlozbaId, korisnikIzlozba.izlozbaId))
      .orderBy(desc(korisnikIzlozba.datumRegistracije));

    return NextResponse.json({ prijave: rows });
  } catch (e: any) {
    if (e?.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    if (e?.message === "FORBIDDEN")
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
