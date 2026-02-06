export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { slike, korisnikIzlozba } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireFotograf } from "@/lib/requireFotograf";

type Ctx = { params: Promise<{ id: string }> };

/// GET /api/izlozbe/:id/slike (GUEST)
export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params;
  const izlozbaId = Number(id);
  if (!Number.isFinite(izlozbaId)) {
    return NextResponse.json({ error: "Neispravan id" }, { status: 400 });
  }

  const rows = await db
    .select({
      slikaId: slike.slikaId,
      nazivFotografa: slike.nazivFotografa,
      opisSlike: slike.opisSlike,
    })
    .from(slike)
    .where(eq(slike.izlozbaId, izlozbaId));

  return NextResponse.json({ slike: rows });
}

/// POST /api/izlozbe/:id/slike (FOTOGRAF)
export async function POST(req: Request, { params }: Ctx) {
  try {
    const { fotografId, claims } = await requireFotograf();
    const { id } = await params;
    const izlozbaId = Number(id);

    if (!Number.isFinite(izlozbaId)) {
      return NextResponse.json({ error: "Neispravan id" }, { status: 400 });
    }

    // mora biti prijavljen na izložbu
    const prijava = await db
      .select()
      .from(korisnikIzlozba)
      .where(
        and(
          eq(korisnikIzlozba.izlozbaId, izlozbaId),
          eq(korisnikIzlozba.korisnikId, claims.sub)
        )
      );

    if (!prijava.length) {
      return NextResponse.json(
        { error: "Fotograf nije prijavljen na izložbu" },
        { status: 403 }
      );
    }
   


    const body = await req.json();
    if (!body.opisSlike) {
      return NextResponse.json({ error: "Nedostaje opis" }, { status: 400 });
    }
    if (!body.slikaUrl) {
  return NextResponse.json({ error: "Nedostaje slikaUrl" }, { status: 400 });
}


    const [created] = await db
      .insert(slike)
      .values({
        fotografId,
        izlozbaId,
        nazivFotografa: claims.imePrezime,
         slikaUrl: body.slikaUrl,  
        opisSlike: body.opisSlike,
      })
      .returning({
        slikaId: slike.slikaId,
        slikaUrl: slike.slikaUrl,
        opisSlike: slike.opisSlike,
      });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e?.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    if (e?.message === "FORBIDDEN")
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });
    if (e?.message === "NO_FOTOGRAF")
      return NextResponse.json({ error: "Niste fotograf" }, { status: 403 });

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
