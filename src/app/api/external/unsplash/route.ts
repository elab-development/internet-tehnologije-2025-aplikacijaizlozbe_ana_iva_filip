import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("query") || "").trim();

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return NextResponse.json({ error: "Missing UNSPLASH_ACCESS_KEY" }, { status: 500 });
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", "landscape");

  const r = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${key}`,
      "Accept-Version": "v1",
    },
    //da se ne kešira pogrešno na serveru
    cache: "no-store",
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json({ error: "Unsplash error", details: text }, { status: 502 });
  }

  const data = await r.json();
  const first = data?.results?.[0];

  if (!first) {
    return NextResponse.json({ url: null }, { status: 200 });
  }

  return NextResponse.json({
    url: first.urls?.regular ?? null,
    author: first.user?.name ?? null,
    page: first.links?.html ?? null,
  });
}