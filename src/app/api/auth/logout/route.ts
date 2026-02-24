import { AUTH_COOKIE } from "@/lib/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { assertSameOrigin } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  try {
      // CSRF zaštita: dozvoljavamo POST samo sa našeg origin-a
      assertSameOrigin(req);
    } catch {
      return NextResponse.json({ error: "CSRF_BLOCKED" }, { status: 403 });
    }
  const res = NextResponse.json({ ok: true });

  res.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return res;
}
