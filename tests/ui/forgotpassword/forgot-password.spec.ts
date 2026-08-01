import { test, expect } from '@playwright/test';
import testData from '../../../data/staging/user.json';

test.describe('Forgot Password - Non POM Version', () => {
  test.beforeEach(async ({ page }) => {
    // Membuka halaman login (baseURL diambil dari playwright.config.ts)
    await page.goto('/login');
    // 1. Klik opsi tautan "Forgot?"
    await page.getByRole('link', { name: 'Forgot?' }).click();
    await expect(page).toHaveURL(/.*forgot-password/); // Memastikan pindah halaman
  });

  test('1-Password reset with a valid, registered email @p0 @positive', async ({ page }) => {
    // 2. Masukkan email di kolom Email
    await page.getByRole('textbox', { name: 'Email' }).fill(testData.forgotPassword.validEmail);
    // 3. Klik tombol "Reset Password"
    await page.getByRole('button', { name: 'Reset Password' }).click();

    // VALIDASI: Sistem memberikan pesan validasi "Reset instructions sent!"
    await expect(page.getByText(testData.forgotPassword.successMessage)).toBeVisible();
  });

  test('2-Password reset with an unregistered email @p1 @positive', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).fill(testData.forgotPassword.unregisteredEmail);
    await page.getByRole('button', { name: 'Reset Password' }).click();

    // VALIDASI: Tetap memberikan pesan sukses demi alasan keamanan (User Enumeration Protection)
    await expect(page.getByText(testData.forgotPassword.successMessage)).toBeVisible();
  });

  test('3-Password reset with an invalid email format @p1 @negative', async ({ page }) => {
    const emailField = page.getByRole('textbox', { name: 'Email' });
    await emailField.fill(testData.forgotPassword.invalidFormatEmail);
    await page.getByRole('button', { name: 'Reset Password' }).click();

    // VALIDASI: Mengambil pesan validasi HTML5 bawaan browser Chrome
    const validationMessage = await emailField.evaluate((element: HTMLInputElement) => element.validationMessage);
    expect(validationMessage).toContain("Please include an '@' in the email address");
  });

  test('4-Password reset with a blank email field @p2 @negative', async ({ page }) => {
    // Langsung klik reset tanpa mengisi email
    await page.getByRole('button', { name: 'Reset Password' }).click();

    // VALIDASI: Mengambil pesan validasi HTML5 "Please fill out this field."
    const emailField = page.getByRole('textbox', { name: 'Email' });
    const validationMessage = await emailField.evaluate((element: HTMLInputElement) => element.validationMessage);
    expect(validationMessage).toBe("Please fill out this field.");
  });

  test('5-Password reset rate limiting for consecutive requests @p2 @negative', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).fill(testData.forgotPassword.validEmail);

    // Melakukan klik berturut-turut dengan cepat (consecutive requests)
    await page.getByRole('button', { name: 'Reset Password' }).click();
    await page.getByRole('button', { name: 'Reset Password' }).click({ clickCount: 2 });

    // VALIDASI: Sesuaikan teks/toast error rate limit yang muncul di sistem Emra Chat kamu
    // Contoh: await expect(page.getByText('Too many requests')).toBeVisible();
  });
});