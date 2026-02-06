export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { izlozbe } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/requireAdmin";

type Ctx = { params: Promise<{ id: string }> };

type UpdateBody = {
  nazivIzlozbe?: string;
  opisIzlozbe?: string | null;
  lokacija?: string;
  datum?: string; // ISO
  status?: string;
};

const toId = (raw: string) => {
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
};

export async function PUT(req: Request, { params }: Ctx) {
  try {
    await requireAdmin();

    const { id: rawId } = await params;
    const id = toId(rawId);
    if (!id) return NextResponse.json({ error: "Neispravan id" }, { status: 400 });

    const body = (await req.json()) as UpdateBody;

    const patch: Partial<typeof izlozbe.$inferInsert> = {};
    if (body.nazivIzlozbe !== undefined) patch.nazivIzlozbe = body.nazivIzlozbe;
    if (body.opisIzlozbe !== undefined) patch.opisIzlozbe = body.opisIzlozbe;
    if (body.lokacija !== undefined) patch.lokacija = body.lokacija;
    if (body.status !== undefined) patch.status = body.status;

    if (body.datum !== undefined) {
      const d = new Date(body.datum);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ error: "Neispravan datum" }, { status: 400 });
      }
      patch.datum = d;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Nema izmena" }, { status: 400 });
    }

    const [updated] = await db
      .update(izlozbe)
      .set(patch)
      .where(eq(izlozbe.izlozbaId, id))
      .returning({
        id: izlozbe.izlozbaId,
        nazivIzlozbe: izlozbe.nazivIzlozbe,
        opisIzlozbe: izlozbe.opisIzlozbe,
        lokacija: izlozbe.lokacija,
        datum: izlozbe.datum,
        status: izlozbe.status,
      });

    if (!updated) {
      return NextResponse.json({ error: "Nije pronađeno" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    if (e?.message === "FORBIDDEN")
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  try {
    await requireAdmin();

    const { id: rawId } = await params;
    const id = toId(rawId);
    if (!id) return NextResponse.json({ error: "Neispravan id" }, { status: 400 });

    const [deleted] = await db
      .delete(izlozbe)
      .where(eq(izlozbe.izlozbaId, id))
      .returning({ id: izlozbe.izlozbaId });

    if (!deleted) {
      return NextResponse.json({ error: "Nije pronađeno" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    if (e?.message === "FORBIDDEN")
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
