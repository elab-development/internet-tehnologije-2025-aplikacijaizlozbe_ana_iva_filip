export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { karte, korisnikIzlozba } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/requireAuth";

export async function GET() {
  try {
    const claims = await requireAuth();

    const rows = await db
      .select({
        kartaId: karte.kartaId,
        qrCodePath: karte.qrCodePath,
        registracijaId: karte.registracijaId,
      })
      .from(karte)
      .innerJoin(
        korisnikIzlozba,
        eq(korisnikIzlozba.registracijaId, karte.registracijaId)
      )
      .where(eq(korisnikIzlozba.korisnikId, claims.sub))
      .orderBy(desc(karte.kartaId));

    return NextResponse.json({ karte: rows });
  } catch (e: any) {
    if (e?.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
