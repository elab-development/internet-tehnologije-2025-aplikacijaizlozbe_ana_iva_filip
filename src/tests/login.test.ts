import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/auth/login/route";

test("POST /api/auth/login -> 400 kad fali email/password", async () => {
  const req = new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  const res = await POST(req as any);
  assert.equal(res.status, 400);
});