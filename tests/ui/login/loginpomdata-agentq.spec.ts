import { test, expect } from '@playwright/test'; // 🟢 Kembali ke Playwright murni
import { LoginAgentQPage } from '../../../pages/login/login-agentq.page'; 
import { testData } from '../../../pages/testdata/test-data';
import { pushTestResultToAgentQ } from '../../../helpers/agentq-helper'; // 🟢 Impor helper baru

test.describe('Login AgentQ Reporting Tests', () => {
  let testStartTime: number;

  test.beforeEach(async () => {
    testStartTime = Date.now(); // Catat waktu mulai
  });

  test.afterEach(async ({}, testInfo) => {
    const executionTime = Date.now() - testStartTime;
    const errorDetails = testInfo.errors.map(e => e.message).join('; ');
    const title = testInfo.title ?? 'Unknown test';
    const status = testInfo.status ?? 'unknown';
    
    // 🟢 Otomatis kirim laporan hasil akhir ke dashboard AgentQ
    await pushTestResultToAgentQ(title, status, executionTime, errorDetails);
  });

  // 🟢 Format judul menggunakan "1-" agar dibaca sebagai TC-1 oleh sistem helper
  test('1-User successfully login with valid credential', async ({ page }) => {
    const loginPage = new LoginAgentQPage(page);

    await loginPage.goto();
    await loginPage.login(testData.login.valid.email, testData.login.valid.password);
    await loginPage.verifyLoginSuccess();
  });

  // Test ini akan otomatis di-skip log-nya oleh helper jika TC-2 belum ada di dashboard web
  test('2-Login failed email invalid use AgentQ AI', async ({ page }) => {
    const loginPage = new LoginAgentQPage(page);

    await loginPage.goto();
    await loginPage.login(testData.login.invalid.unregisteredEmail, testData.login.valid.password);
    await loginPage.verifyInvalidCredentials();
  });
});