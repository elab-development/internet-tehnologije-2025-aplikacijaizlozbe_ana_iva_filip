import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/auth/register/route";

test("POST /api/auth/register -> 400 kad fali payload", async () => {
  const req = new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  const res = await POST(req as any);
  assert.equal(res.status, 400);
});