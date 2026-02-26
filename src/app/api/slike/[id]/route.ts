export const runtime = "nodejs";

import { db } from "@/db";
import { slike } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireFotograf } from "@/lib/requireFotograf";
import { requireAdmin } from "@/lib/requireAdmin";
import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/csrf";

type Ctx = { params: Promise<{ id: string }> };

/// PUT /api/slike/:id
export async function PUT(req: NextRequest, { params }: Ctx) {
 /* try {
    // CSRF zaštita
    assertSameOrigin(req);
  } catch {
    return NextResponse.json({ error: "CSRF_BLOCKED" }, { status: 403 });
  }*/

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
        and(
          eq(slike.slikaId, slikaId),
          eq(slike.fotografId, fotografId) // sme da menja samo SVOJU sliku
        )
      )
      .returning({ id: slike.slikaId });

    if (!updated) {
      return NextResponse.json(
        { error: "Slika nije pronađena ili niste njen autor" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    try {
      await requireAdmin();

      const [adminUpdated] = await db
        .update(slike)
        .set({ opisSlike: body.opisSlike })
        .where(eq(slike.slikaId, slikaId))
        .returning({ id: slike.slikaId });

      if (!adminUpdated) {
        return NextResponse.json({ error: "Nije pronađeno" }, { status: 404 });
      }

      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "Zabranjen pristup" }, { status: 403 });
    }
  }
}

/// DELETE /api/slike/:id
export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
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
      .where(
        and(
          eq(slike.slikaId, slikaId),
          eq(slike.fotografId, fotografId) //sme da briše samo SVOJU sliku
        )
      )
      .returning({ id: slike.slikaId });

    if (!deleted) {
      return NextResponse.json(
        { error: "Slika nije pronađena ili niste njen autor" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    try {
      await requireAdmin();

      const [adminDeleted] = await db
        .delete(slike)
        .where(eq(slike.slikaId, slikaId))
        .returning({ id: slike.slikaId });

      if (!adminDeleted) {
        return NextResponse.json({ error: "Nije pronađeno" }, { status: 404 });
      }

      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "Zabranjen pristup" }, { status: 403 });
    }
  }
}