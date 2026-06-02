const { test, expect } = require('@playwright/test');

test('health endpoint smoke test', async ({ request }) => {
  const response = await request.get('http://localhost:3000/health');

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.status).toBe('ok');
});