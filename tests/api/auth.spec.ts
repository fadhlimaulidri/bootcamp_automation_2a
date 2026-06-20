import { test, expect } from '@playwright/test';

test('User successfully logged in using valid credential @api @login @p0 @smoketest', async ({ request }) => {
  // precondition
  const baseURL = process.env.API_BASE_URL || 'https://api.emra.chat';

  // step
  const response = await request.post(`${baseURL}/api/v1/auth/login`, {
    data: {
        "auth": {
            "email": "user@example.com",
            "password": "password123"
        }
    },
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  });

  // expected resutl
  expect(response.status()).toBe(200);
});