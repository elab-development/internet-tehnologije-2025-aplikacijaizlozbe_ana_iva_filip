import test from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../app/api/health/route';

test('GET /api/health returns 200', async () => {
  const res = await GET();  

  assert.equal(res.status, 200);

  const body = await res.json();
  assert.equal(body.status, 'ok');
});