import { test, expect } from '@playwright/test';

test('API Test get method public endpoint @api @public @p0 @smoketest', async ({ request }) => {
  // precondition
  const baseURL = process.env.API_BASE_URL || 'https://api.emra.chat';

  // step
  const response = await request.get(`${baseURL}//api/v1/public`, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  });

  // expected resutl
  expect(response.status()).toBe(200);
});