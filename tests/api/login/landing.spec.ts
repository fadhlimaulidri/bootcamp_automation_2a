import { test, expect } from '@playwright/test';

test('API Test Sederhana', async ({ request }) => {
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3000';

  // Gunakan param 'request', jangan 'page'
  const response = await request.post(`${baseURL}/api/v1/auth/login`, {
    data: { auth: { email: 'user@emra.chat', password: 'wrongpass' } },
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  });

  // Validasi status code (harusnya 401 Unauthorized jika password salah)
  expect(response.status()).toBe(401);
});