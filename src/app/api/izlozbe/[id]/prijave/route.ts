export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnikIzlozba } from "@/db/schema";
import { requireAuth } from "@/lib/requireAuth";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Ctx) {
  try {
    const claims = await requireAuth();
    const { id: rawId } = await params;

    const izlozbaId = Number(rawId);
    if (!Number.isFinite(izlozbaId)) {
      return NextResponse.json({ error: "Neispravan id izložbe" }, { status: 400 });
    }

    const [row] = await db
      .insert(korisnikIzlozba)
      .values({
        korisnikId: claims.sub,
        izlozbaId,
      })
      .returning({
        registracijaId: korisnikIzlozba.registracijaId,
        izlozbaId: korisnikIzlozba.izlozbaId,
        korisnikId: korisnikIzlozba.korisnikId,
        datumRegistracije: korisnikIzlozba.datumRegistracije,
      });

    return NextResponse.json(row, { status: 201 });
  } catch (e: any) {
    if (e?.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });

    // Unique violation (dupla prijava) – Postgres code 23505
    const pgCode = e?.cause?.code ?? e?.code;
    const msg = String(e?.message ?? "");
    if (pgCode === "23505" || msg.includes("korisnik_izlozba_uq")) {
      return NextResponse.json({ error: "Već ste prijavljeni" }, { status: 409 });
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
