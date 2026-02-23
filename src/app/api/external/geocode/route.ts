import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("query") || "").trim();

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const r = await fetch(url.toString(), {
    headers: {
      // Nominatim traži identifikaciju klijenta
      "User-Agent": "iteh-izlozbe/1.0 (student-project)",
      "Accept-Language": "sr,en;q=0.8",
    },
    cache: "no-store",
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json(
      { error: "Geocode error", details: text },
      { status: 502 }
    );
  }

  const data = (await r.json()) as Array<any>;
  const first = data?.[0];

  if (!first) {
    return NextResponse.json({ lat: null, lon: null, displayName: null });
  }

  return NextResponse.json({
    lat: first.lat,
    lon: first.lon,
    displayName: first.display_name ?? null,
  });
}