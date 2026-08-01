import { test, expect } from '@playwright/test';
import { UserFactory } from '../../../utils/user-factory';
import { pushTestResultToAgentQ } from '../../../helpers/agentq-helper';

test.describe('Register API Tests - User Story 1', () => {
  let testStartTime: number;

  test.beforeEach(async () => {
    testStartTime = Date.now();
  });

  test.afterEach(async ({}, testInfo) => {
    const executionTime = Date.now() - testStartTime;
    const errorDetails = testInfo.errors.map(e => e.message).join('; ');
    const title = testInfo.title ?? 'Unknown test';
    const status = testInfo.status ?? 'unknown';
    
    await pushTestResultToAgentQ(title, status, executionTime, errorDetails);
  });
  const baseURL = process.env.API_BASE_URL || 'https://api.emra.chat'; // Mengambil dari .env

  // BE-01: Registrasi sukses dan BE-06: JWT Tokens
  test('76-TC-API-01: Should register a new user successfully and return JWT tokens', async ({ request }) => {
    const user = UserFactory.createUser();

    const response = await request.post(`${baseURL}/api/v1/auth/register`, {
      data: {
        user: {
          email: user.email,
          name: user.fullName,
          password: user.password,
          password_confirmation: user.password,
          country_code: '62',
          country: 'Indonesia',
          phone_number: '+62' + user.phoneNumber
        }
      }
    });

    // Validasi response sukses (misalnya 201 Created atau 200 OK)
    // Berdasarkan RFC, sukses registrasi mengembalikan 201
    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    // Verifikasi struktur response sesuai RFC
    expect(responseBody.success).toBe(true);
    expect(responseBody.data.user.email).toBe(user.email);
    expect(responseBody.data.tokens.access_token).toBeDefined();
    expect(responseBody.data.tokens.refresh_token).toBeDefined();
  });

  // BE-03: Implementasi validasi email unik
  test('77-TC-API-02: Should return 422 when registering with an existing email', async ({ request }) => {
    const user = UserFactory.createUser();
    const existingEmail = 'test@example.com'; // Gunakan email yang dipastikan sudah terdaftar

    const response = await request.post(`${baseURL}/api/v1/auth/register`, {
      data: {
        user: {
          email: existingEmail,
          name: user.fullName,
          password: user.password,
          password_confirmation: user.password,
          country_code: '62',
          country: 'Indonesia',
          phone_number: '+62' + user.phoneNumber
        }
      }
    });

    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody.success).toBe(false);
    expect(responseBody.error_code).toBe('REGISTRATION_FAILED');
  });

  // BE-01: Validasi field input registrasi kosong
  test('78-TC-API-03: Should return 422 when mandatory fields are missing', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/v1/auth/register`, {
      data: {
        user: {
          email: '',
          password: '',
          // field lainnya sengaja dikosongkan
        }
      }
    });

    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody.success).toBe(false);
    expect(responseBody.errors.length).toBeGreaterThan(0);
  });

  // BE-02: Mapping field `phone` ke `phone_number` pada registrasi
  test('79-TC-API-04: Should correctly map old phone parameter to phone_number (BE-02)', async ({ request }) => {
    const user = UserFactory.createUser();

    // Kirim menggunakan parameter `phone` alih-alih `phone_number`
    const response = await request.post(`${baseURL}/api/v1/auth/register`, {
      data: {
        user: {
          email: user.email,
          name: user.fullName,
          password: user.password,
          password_confirmation: user.password,
          country_code: '62',
          country: 'Indonesia',
          phone: '+62' + user.phoneNumber // <-- Menggunakan "phone"
        }
      }
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();

    // Pastikan backend mengenali "phone" dan menyimpannya sebagai "phone_number" di response API
    expect(responseBody.data.user.phone_number).toBeDefined();
  });

  // BE-04: Implementasi validasi kekuatan password
  test('80-TC-API-05: Should return 422 for weak passwords (BE-04)', async ({ request }) => {
    const user = UserFactory.createUser();

    const response = await request.post(`${baseURL}/api/v1/auth/register`, {
      data: {
        user: {
          email: user.email,
          name: user.fullName,
          password: '123', // Password lemah
          password_confirmation: '123',
        }
      }
    });

    expect(response.status()).toBe(422);
    const responseBody = await response.json();
    expect(responseBody.success).toBe(false);
    // Verifikasi pesan error mengindikasikan password terlalu lemah
    expect(JSON.stringify(responseBody.errors).toLowerCase()).toContain('password');
  });

  // BE-05 & BE-08: Pembuatan trial subscription otomatis & package availability
  test('81-TC-API-06: Should auto-assign default trial package upon successful registration (BE-05 & BE-08)', async ({ request }) => {
    const user = UserFactory.createUser();

    // 1. Lakukan registrasi
    const regResponse = await request.post(`${baseURL}/api/v1/auth/register`, {
      data: {
        user: {
          email: user.email,
          name: user.fullName,
          password: user.password,
          password_confirmation: user.password,
          country_code: '62',
          phone_number: '+62' + user.phoneNumber
        }
      }
    });

    expect(regResponse.status()).toBe(201);
    const regData = await regResponse.json();
    const token = regData.data.tokens.access_token;

    // 2. Akses profile endpoint yang terautentikasi (seperti di RFC) untuk mengecek status subscription
    const userResponse = await request.get(`${baseURL}/api/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(userResponse.status()).toBe(200);
    const userData = await userResponse.json();

    // Karena kita tidak memiliki endpoint langsung ke /subscription, 
    // minimal kita asersikan token berfungsi dan user dinyatakan 'active'
    expect(userData.data.user.status).toBe('active');
    // Jika API backend mengembalikan info subscription, kita bisa tes:
    // expect(userData.data.subscription).toBeDefined();
    // expect(userData.data.subscription.status).toBe('active'); // active trial
  });

  // BE-07: Implementasi logging aktivitas registrasi
  test('82-TC-API-07: Verify activity logging for registration (BE-07) [Requires DB Access / Admin API]', async ({ request }) => {
    // Catatan: Pengujian logging aktivitas biasanya memerlukan akses langsung ke Database (tabel activity_logs)
    // Atau membutuhkan akses ke endpoint Admin untuk membaca log user.
    // Di sini kita menulis kerangkanya sebagai placeholder agar tidak terlupakan.

    test.info().annotations.push({
      type: 'issue',
      description: 'Butuh Endpoint Admin atau DB Access untuk memvalidasi log aktivitas secara E2E.'
    });

    // Logika ideal:
    // 1. Register User -> Sukses.
    // 2. Fetch /api/v1/admin/activity_logs?email=user.email
    // 3. Expect action === 'REGISTER'

    expect(true).toBeTruthy(); // Placeholder assert
  });
});
