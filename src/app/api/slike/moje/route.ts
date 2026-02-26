export const runtime = "nodejs";

import { db } from "@/db";
import { slike } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireFotograf } from "@/lib/requireFotograf";
import { NextResponse } from "next/server";

/**
 * GET /api/slike/moje
 * Vraća sve slike koje pripadaju trenutno ulogovanom fotografu
 */
export async function GET() {
  try {
    const { fotografId } = await requireFotograf();
    const rezultati = await db
      .select()
      .from(slike)
      .where(eq(slike.fotografId, fotografId));

    return NextResponse.json({ slike: rezultati });
  } catch (error) {
    return NextResponse.json(
      { error: "Morate biti ulogovani kao fotograf" },
      { status: 401 }
    );
  }
}