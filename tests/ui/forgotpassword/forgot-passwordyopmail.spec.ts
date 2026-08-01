import { test, expect } from '@playwright/test';

test('Validasi Email Forgot Password pakai Yopmail', async ({ browser, page }) => {
  // 1. Buat nama email unik menggunakan timestamp agar tidak tabrakan dengan orang lain
  const emailUser = `emra-test-${Date.now()}`; // Hasilnya misal: emra-test-1718123456
  const fullEmail = `${emailUser}@yopmail.com`;

  // 2. JALANKAN PROSES FORGOT PASSWORD DI WEB EMRA CHAT
  await page.goto('/login');
  await page.getByRole('link', { name: 'Forgot?' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(fullEmail);
  await page.getByRole('button', { name: 'Reset Password' }).click();
  
  // Pastikan alert sukses di frontend muncul duluan
  await expect(page.getByText('Reset instructions sent!')).toBeVisible();

  // 3. BUKA TAB BARU DI BROWSER UNTUK CEK YOPMAIL
  const context = page.context();
  const yopmailPage = await context.newPage();
  
  // Langsung tembak ke inbox-nya menggunakan URL shortcut
  await yopmailPage.goto(`https://yopmail.com?login=${emailUser}`);

  // 4. TRICKY PART: Membaca teks di dalam IFRAME Yopmail
  // Yopmail membungkus list email di iframe bernama 'ifinbox', dan isi surat di iframe 'ifmail'
  const iframeInbox = yopmailPage.frameLocator('#ifinbox');
  const iframeMailBody = yopmailPage.frameLocator('#ifmail');

  // Klik email teratas yang masuk dari Emra Chat (tunggu sampai muncul)
  // Sesuaikan teks 'Emra Chat' dengan nama sender yang muncul di email aslinya nanti
  await iframeInbox.getByText('Emra Chat', { exact: false }).first().click();

  // 5. VALIDASI ISI EMAILNYA
  // Kita berpindah ke iframe isi surat (ifmail) untuk membaca teks atau klik link di dalamnya
  const emailText = iframeMailBody.locator('body');
  await expect(emailText).toContainText('Reset instructions'); 
  
  // (Opsional) Jika ingin klik link reset password yang ada di dalam email:
  // await iframeMailBody.getByRole('link', { name: 'Reset Password' }).click();
});