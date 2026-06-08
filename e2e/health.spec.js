const { test, expect } = require('@playwright/test');

test('health endpoint returns ok', async ({ request }) => {
  const res = await request.get('/health');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe('ok');
});

test('GET /users returns array', async ({ request }) => {
  const res = await request.get('/users');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body)).toBe(true);
});
