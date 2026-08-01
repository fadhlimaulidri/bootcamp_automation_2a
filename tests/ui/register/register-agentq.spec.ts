import { expect, test } from '@playwright/test';
import { RegisterAgentQPage } from '../../../pages/register/register-agentq.page';
import { UserFactory } from '../../../utils/user-factory';
import { pushTestResultToAgentQ } from '../../../helpers/agentq-helper';

test.describe('Register AgentQ Reporting Tests', () => {
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

  //  Diubah jadi 2- karena di AgentQ ID-nya adalah TC-2
  test('64-Register success using valid credential', async ({ page }) => {
    const user = UserFactory.createUser();
    const registerPage = new RegisterAgentQPage(page);

    await registerPage.goto();
    await registerPage.register(user);
    await registerPage.verifyRegisterSuccess();
  });

  //  Diubah jadi 4- karena di AgentQ ID-nya adalah TC-4
  test('65-Register failed using already registered email', async ({ page }) => {
    const registerPage = new RegisterAgentQPage(page);
    const user = UserFactory.createUser();
    user.email = 'nuruddinam46@gmail.com'; 

    await registerPage.goto();
    await registerPage.register(user); 
    await registerPage.verifyErrorMessageIsVisible('Email has already been taken');
  });

  //  Diubah jadi 5- karena di AgentQ ID-nya adalah TC-5
  test('66-Register failed with mismatched confirm password', async ({ page }) => {
    const registerPage = new RegisterAgentQPage(page);
    const user = UserFactory.createUser();

    await registerPage.goto();
    await registerPage.fillStep1(user.email, user.password, 'berbeda!3'); 
    await expect(registerPage.nextButton).toBeDisabled();
    await registerPage.verifyErrorMessageIsVisible('Passwords do not match');
  });

  //  Diubah jadi 6- karena di AgentQ ID-nya adalah TC-6
  test('67-Register failed with format email invalid', async ({ page }) => {
    const registerPage = new RegisterAgentQPage(page);
    const user = UserFactory.createUser();

    await registerPage.goto();
    await registerPage.fillStep1('1', user.password, user.password); 
    await expect(registerPage.nextButton).toBeDisabled();
    await registerPage.verifyErrorMessageIsVisible('Please enter a valid email address');
  });

  //  Diubah jadi 7- karena di AgentQ ID-nya adalah TC-7
  test('68-Register failed with invalid phone number format', async ({ page }) => {
    const registerPage = new RegisterAgentQPage(page);
    const user = UserFactory.createUser();

    await registerPage.goto();
    await registerPage.fillStep1(user.email, user.password, user.password); 
    await registerPage.clickNext();

    await registerPage.fillStep2(user.fullName, '8969'); 
    await registerPage.clickNext();
    await registerPage.verifyErrorMessageIsVisible('Please enter a valid phone number (9-13 digits)');
  });

  //  Diubah jadi 8- karena di AgentQ ID-nya adalah TC-8
  test('69-Register failed with empty email and password', async ({ page }) => {
    const registerPage = new RegisterAgentQPage(page);

    await registerPage.goto();
    // Kosongkan email dan password
    await registerPage.fillStep1('', '', ''); 
    // Tombol Next harusnya disable ketika form wajib kosong
    await expect(registerPage.nextButton).toBeDisabled();
  });

  //  Diubah jadi 9- karena di AgentQ ID-nya adalah TC-9
  test('70-Register failed with weak password', async ({ page }) => {
    const registerPage = new RegisterAgentQPage(page);
    const user = UserFactory.createUser();

    await registerPage.goto();
    // Password lemah (kurang dari 8 karakter)
    await registerPage.fillStep1(user.email, '12345', '12345'); 
    await expect(registerPage.nextButton).toBeDisabled();
  });

  //  Diubah jadi 10- karena di AgentQ ID-nya adalah TC-10
  test('71-Register failed with empty full name in Step 2', async ({ page }) => {
    const registerPage = new RegisterAgentQPage(page);
    const user = UserFactory.createUser();

    await registerPage.goto();
    // Step 1 lolos
    await registerPage.fillStep1(user.email, user.password, user.password); 
    await registerPage.clickNext();

    // Step 2 kosongkan Full Name
    await registerPage.fillStep2('', user.phoneNumber); 
    await expect(registerPage.nextButton).toBeDisabled();
  });

  //  Diubah jadi 11- karena di AgentQ ID-nya adalah TC-11
  test('72-Register failed with empty company name in Step 3', async ({ page }) => {
    const registerPage = new RegisterAgentQPage(page);
    const user = UserFactory.createUser();

    await registerPage.goto();
    // Step 1 lolos
    await registerPage.fillStep1(user.email, user.password, user.password); 
    await registerPage.clickNext();

    // Step 2 lolos
    await registerPage.fillStep2(user.fullName, user.phoneNumber); 
    await registerPage.clickNext();

    // Step 3 kosongkan Company Name secara manual
    await registerPage.companyNameField.fill('');
    await registerPage.industryDropdown.selectOption(user.industry);
    await registerPage.companySizeDropdown.selectOption(user.companySize);
    
    // Klik tombol submit
    await registerPage.createAccountButton.click();
    
    // Form tidak akan tersubmit karena HTML5 validation (atribut required) pada frontend
    // Kita cek bahwa validasi bawaan browser muncul di field tersebut
    const validationMessage = await registerPage.companyNameField.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).not.toBe(''); // Memastikan ada pesan "Please fill out this field"
  });

  // TC-12: Verifikasi penyimpanan Token JWT di Local Storage setelah sukses registrasi (Sesuai tugas FE-06)
  test('73-Register success and verify JWT token in local storage', async ({ page }) => {
    const registerPage = new RegisterAgentQPage(page);
    const user = UserFactory.createUser();

    await registerPage.goto();
    // Isi form sampai selesai
    await registerPage.fillStep1(user.email, user.password, user.password); 
    await registerPage.clickNext();
    await registerPage.fillStep2(user.fullName, user.phoneNumber); 
    await registerPage.clickNext();
    // Di isi karena mandatory di frontend
    await registerPage.companyNameField.fill('My Company');
    await registerPage.industryDropdown.selectOption(user.industry);
    await registerPage.companySizeDropdown.selectOption(user.companySize);
    
    await registerPage.createAccountButton.click();
    await registerPage.verifyRegisterSuccess();

    // Verifikasi localStorage memiliki token (seperti dijabarkan di RFC)
    // Tunggu sampai token diset oleh frontend
    await page.waitForFunction(() => localStorage.getItem('access_token') !== null, { timeout: 5000 }).catch(() => {});
    
    const accessToken = await page.evaluate(() => localStorage.getItem('access_token'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('refresh_token'));
    
    // Asersi bahwa token tidak null (atau disesuaikan dengan implementasi asli jika nama key berbeda)
    // Menggunakan toBeTruthy() atau expect(accessToken).not.toBeNull()
    // Catatan: Jika aplikasi aslinya belum menggunakan 'access_token', test ini akan failed dan bisa dilaporkan sebagai bug FE
    expect(accessToken, 'Access token should be stored in local storage').toBeTruthy();
  });

  // TC-13: Verifikasi API Payload mapping (phone_number vs phone) (Sesuai tugas BE-02 / FE)
  test('74-Register success and verify API payload mapping', async ({ page }) => {
    const registerPage = new RegisterAgentQPage(page);
    const user = UserFactory.createUser();

    // Intercept request ke endpoint registrasi untuk mengecek payload
    const requestPromise = page.waitForRequest(request => 
      request.url().includes('/api/v1/auth/register') && request.method() === 'POST'
    );

    await registerPage.goto();
    await registerPage.fillStep1(user.email, user.password, user.password); 
    await registerPage.clickNext();
    await registerPage.fillStep2(user.fullName, user.phoneNumber); 
    await registerPage.clickNext();
    await registerPage.companyNameField.fill('My Company');
    await registerPage.industryDropdown.selectOption(user.industry);
    await registerPage.companySizeDropdown.selectOption(user.companySize);
    
    await registerPage.createAccountButton.click();
    
    // Tangkap request
    const request = await requestPromise;
    const postData = JSON.parse(request.postData() || '{}');
    
    // Verifikasi mapping parameter phone_number
    // Struktur JSON asumsikan: { user: { phone_number: ... } } atau langsung di root
    const payloadPhoneNumber = postData.user?.phone_number || postData.phone_number;
    const payloadPhone = postData.user?.phone || postData.phone;
    
    expect(payloadPhoneNumber, 'API payload should map to phone_number').toBe(user.phoneNumber);
    expect(payloadPhone, 'API payload should NOT use old phone parameter').toBeUndefined();
  });

  // TC-14: Verifikasi Redirect URL setelah sukses registrasi (Sesuai tugas FE-07)
  test('75-Register success and verify redirect URL', async ({ page }) => {
    const registerPage = new RegisterAgentQPage(page);
    const user = UserFactory.createUser();

    await registerPage.goto();
    await registerPage.fillStep1(user.email, user.password, user.password); 
    await registerPage.clickNext();
    await registerPage.fillStep2(user.fullName, user.phoneNumber); 
    await registerPage.clickNext();
    await registerPage.companyNameField.fill('My Company');
    await registerPage.industryDropdown.selectOption(user.industry);
    await registerPage.companySizeDropdown.selectOption(user.companySize);
    
    await registerPage.createAccountButton.click();
    await registerPage.verifyRegisterSuccess();

    // Verifikasi URL berubah (bukan lagi di /register atau /signup)
    // Sesuai RFC, diarahkan ke dashboard atau onboarding
    await expect(page).not.toHaveURL(/.*signup|register.*/);
  });
});