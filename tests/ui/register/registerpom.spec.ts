import { expect, test } from '@playwright/test';
import { RegisterPage } from '../../../pages/register/register.page';
import { UserFactory } from '../../../utils/user-factory';

//Positive TC
test('6-Register success using valid credential @p0 @register', async ({ page }) => {
  const user = UserFactory.createUser();
  const registerPage = new RegisterPage(page);
  // console.log('Register User:', user);
  await registerPage.goto();
  await registerPage.register(user);
  await registerPage.verifyRegisterSuccess();
});

//Negative TC
test('7-Register failed using already registered email @p1 @register', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const user = UserFactory.createUser();
    user.email = 'nuruddinam46@gmail.com'; // Paksa pakai email yang sudah terdaftar

    await registerPage.goto();
    await registerPage.register(user); // Panggil full step karena email duplikat ketahuannya di akhir
    await registerPage.verifyErrorMessageIsVisible('Email has already been taken');
  });

  test('8-Register failed with mismatched confirm password @p2 @register', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const user = UserFactory.createUser();

    await registerPage.goto();
    await registerPage.fillStep1(user.email, user.password, 'berbeda!3'); 
    // VALIDASI: Pastikan tombol Next terkunci otomatis (tidak bisa diklik)
    await expect(registerPage.nextButton).toBeDisabled();
    await registerPage.verifyErrorMessageIsVisible('Passwords do not match');
  });

  test('9-Register failed with format email invalid @p1 @register', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const user = UserFactory.createUser();

    await registerPage.goto();
    // Kosongkan email
    await registerPage.fillStep1('1', user.password, user.password); 
    // VALIDASI: Pastikan tombol Next terkunci otomatis
    await expect(registerPage.nextButton).toBeDisabled();
    await registerPage.verifyErrorMessageIsVisible('Please enter a valid email address');
  });

  test('10-Register failed with invalid phone number format @p2 @register', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const user = UserFactory.createUser();

    await registerPage.goto();
    await registerPage.fillStep1(user.email, user.password, user.password); // Step 1 lolos
    await registerPage.clickNext();

    await registerPage.fillStep2(user.fullName, '8969'); // Stop di Step 2 karena nomor telepon salah
    await registerPage.clickNext();
    await registerPage.verifyErrorMessageIsVisible('Please enter a valid phone number (9-13 digits)');
  });


