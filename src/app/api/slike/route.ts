export const runtime = "nodejs";

import { db } from "@/db";
import { slike } from "@/db/schema";
import { requireFotograf } from "@/lib/requireFotograf";
import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  /*try {
    assertSameOrigin(req);
  } catch {
    return NextResponse.json({ error: "CSRF_BLOCKED" }, { status: 403 });
  }*/

  try {
    const fotograf = await requireFotograf(); 
    const body = await req.json();

    if (!body.opisSlike || !body.slikaUrl || !body.izlozbaId) {
      return NextResponse.json({ error: "Nedostaju obavezni podaci" }, { status: 400 });
    }

    const rezultati = await db.insert(slike).values({
      opisSlike: body.opisSlike,
      slikaUrl: body.slikaUrl,
      izlozbaId: Number(body.izlozbaId),
      fotografId: fotograf.fotografId,
      nazivFotografa: (fotograf.claims as any).ime_prezime || "Stefan Stefan", 
    }).returning({ id: slike.slikaId });

    return NextResponse.json({ ok: true, id: rezultati[0].id });
  } catch (error) {
    console.error("Greška pri POST:", error);
    return NextResponse.json({ error: "Zabranjen pristup ili serverska greška" }, { status: 403 });
  }
}