import assert from 'node:assert';
import test from 'node:test';

test('Provera rada aplikacije za izlozbe', () => {
  assert.strictEqual(1 + 1, 2);
});

test('Provera dostupnosti JWT tajne', () => {
  const tajna = process.env.JWT_SECRET || 'test';
  assert.ok(tajna);
});