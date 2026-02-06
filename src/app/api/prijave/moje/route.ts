export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnikIzlozba, izlozbe } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/requireAuth";

export async function GET() {
  try {
    const claims = await requireAuth();

    const rows = await db
      .select({
        registracijaId: korisnikIzlozba.registracijaId,
        datumRegistracije: korisnikIzlozba.datumRegistracije,
        izlozbaId: izlozbe.izlozbaId,
        nazivIzlozbe: izlozbe.nazivIzlozbe,
        lokacija: izlozbe.lokacija,
        datumIzlozbe: izlozbe.datum,
        status: izlozbe.status,
      })
      .from(korisnikIzlozba)
      .innerJoin(izlozbe, eq(izlozbe.izlozbaId, korisnikIzlozba.izlozbaId))
      .where(eq(korisnikIzlozba.korisnikId, claims.sub))
      .orderBy(desc(korisnikIzlozba.datumRegistracije));

    return NextResponse.json({ prijave: rows });
  } catch (e: any) {
    if (e?.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
