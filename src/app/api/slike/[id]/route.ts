export const runtime = "nodejs";


import { db } from "@/db";
import { slike } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireFotograf } from "@/lib/requireFotograf";
import { requireAdmin } from "@/lib/requireAdmin";
import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/csrf";

type Ctx = { params: Promise<{ id: string }> };

/// PUT /api/slike/:id
export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    // CSRF zaštita: dozvoljavamo PUT samo sa našeg origin-a
    assertSameOrigin(req);
  } catch {
    return NextResponse.json({ error: "CSRF_BLOCKED" }, { status: 403 });
  }
  const { id } = await params;
  const slikaId = Number(id);
  if (!Number.isFinite(slikaId)) {
    return NextResponse.json({ error: "Neispravan id" }, { status: 400 });
  }

  const body = await req.json();
  if (!body.opisSlike) {
    return NextResponse.json({ error: "Nedostaje opis" }, { status: 400 });
  }

  try {
    const { fotografId } = await requireFotograf();

    const [updated] = await db
      .update(slike)
      .set({ opisSlike: body.opisSlike })
      .where(
        eq(slike.slikaId, slikaId)
      )
      .returning({ id: slike.slikaId });

    if (!updated) {
      return NextResponse.json({ error: "Nije pronađeno" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    // ako nije fotograf, probaj admin
    await requireAdmin();

    await db
      .update(slike)
      .set({ opisSlike: body.opisSlike })
      .where(eq(slike.slikaId, slikaId));

    return NextResponse.json({ ok: true });
  }
}

/// DELETE /api/slike/:id
export async function DELETE(req: NextRequest, { params }: Ctx) {
   try {
      // CSRF zaštita: dozvoljavamo DELETE samo sa našeg origin-a
      assertSameOrigin(req);
    } catch {
      return NextResponse.json({ error: "CSRF_BLOCKED" }, { status: 403 });
    }
  const { id } = await params;
  const slikaId = Number(id);
  if (!Number.isFinite(slikaId)) {
    return NextResponse.json({ error: "Neispravan id" }, { status: 400 });
  }

  try {
    const { fotografId } = await requireFotograf();

    const [deleted] = await db
      .delete(slike)
      .where(eq(slike.slikaId, slikaId))
      .returning({ id: slike.slikaId });

    if (!deleted) {
      return NextResponse.json({ error: "Nije pronađeno" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    await requireAdmin();

    await db.delete(slike).where(eq(slike.slikaId, slikaId));
    return NextResponse.json({ ok: true });
  }
}
