export const runtime = "nodejs";


import { db } from "@/db";
import { izlozbe } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/requireAdmin";
import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/csrf";

type CreateBody = {
  nazivIzlozbe: string;
  opisIzlozbe?: string | null;
  lokacija: string;
  datum: string; // ISO string
  status?: string; // "AKTIVNA"...
};

/**
 *  @openapi
 *  /api/izlozbe:
 *    get:
 *      summary:.Prikaz svih izložbi
 *      description:.Vraća listu svih izložbi sa osnovnim detaljima (naziv, lokacija, datum).
 *      responses:
 *        200:
 *          description:.Lista izložbi uspešno učitana.
 */
export async function GET() {
  const data = await db
    .select({
      id: izlozbe.izlozbaId,
      nazivIzlozbe: izlozbe.nazivIzlozbe,
      lokacija: izlozbe.lokacija,
      datum: izlozbe.datum,
      status: izlozbe.status,
    })
    .from(izlozbe)
    .orderBy(desc(izlozbe.datum));

  return NextResponse.json({ izlozbe: data });
}

export async function POST(req: NextRequest) {
   try {
      // CSRF zaštita: dozvoljavamo POST samo sa našeg origin-a
      assertSameOrigin(req);
    } catch {
      return NextResponse.json({ error: "CSRF_BLOCKED" }, { status: 403 });
    }
  try {
    await requireAdmin();

    const body = (await req.json()) as CreateBody;

    if (!body.nazivIzlozbe || !body.lokacija || !body.datum) {
      return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
    }

    const datum = new Date(body.datum);
    if (Number.isNaN(datum.getTime())) {
      return NextResponse.json({ error: "Neispravan datum" }, { status: 400 });
    }

    const [created] = await db
      .insert(izlozbe)
      .values({
        nazivIzlozbe: body.nazivIzlozbe,
        opisIzlozbe: body.opisIzlozbe ?? null,
        lokacija: body.lokacija,
        datum,
        status: body.status ?? "AKTIVNA",
      })
      .returning({
        id: izlozbe.izlozbaId,
        nazivIzlozbe: izlozbe.nazivIzlozbe,
        opisIzlozbe: izlozbe.opisIzlozbe,
        lokacija: izlozbe.lokacija,
        datum: izlozbe.datum,
        status: izlozbe.status,
      });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e?.message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    if (e?.message === "FORBIDDEN")
      return NextResponse.json({ error: "Zabranjeno" }, { status: 403 });

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}