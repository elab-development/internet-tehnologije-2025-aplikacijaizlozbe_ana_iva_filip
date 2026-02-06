export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnikIzlozba } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/requireAuth";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_: Request, { params }: Ctx) {
  try {
    const claims = await requireAuth();
    const { id: rawId } = await params;

    const registracijaId = Number(rawId);
    if (!Number.isFinite(registracijaId)) {
      return NextResponse.json({ error: "Neispravan id prijave" }, { status: 400 });
    }

    const where =
      claims.rola === "ADMIN"
        ? eq(korisnikIzlozba.registracijaId, registracijaId)
        : and(
            eq(korisnikIzlozba.registracijaId, registracijaId),
            eq(korisnikIzlozba.korisnikId, claims.sub)
          );

    const [deleted] = await db
      .delete(korisnikIzlozba)
      .where(where)
      .returning({ id: korisnikIzlozba.registracijaId });

    if (!deleted) return NextResponse.json({ error: "Nije pronađeno" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
