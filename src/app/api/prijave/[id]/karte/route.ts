export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { karte, korisnikIzlozba } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/requireAdmin";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Ctx) {
  try {
    await requireAdmin();

    const { id } = await params;
    const registracijaId = Number(id);
    if (!Number.isFinite(registracijaId)) {
      return NextResponse.json({ error: "Neispravan id prijave" }, { status: 400 });
    }

    // proveri da li prijava postoji
    const prijava = await db
      .select()
      .from(korisnikIzlozba)
      .where(eq(korisnikIzlozba.registracijaId, registracijaId));

    if (!prijava.length) {
      return NextResponse.json({ error: "Prijava ne postoji" }, { status: 404 });
    }

    const [karta] = await db
      .insert(karte)
      .values({
        registracijaId,
        qrCodePath: `qr/prijava-${registracijaId}.png`,
      })
      .returning({
        kartaId: karte.kartaId,
        registracijaId: karte.registracijaId,
        qrCodePath: karte.qrCodePath,
      });

    return NextResponse.json(karta, { status: 201 });
  } catch (e: any) {
    if (e?.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    if (e?.message === "FORBIDDEN")
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
