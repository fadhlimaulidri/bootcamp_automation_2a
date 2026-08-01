// import { test } from '@playwright/test';
// import { faker } from '@faker-js/faker';
// import { RegisterPage } from '../../pages/register.page';
// import { LoginPage } from '../../pages/login.page';
// import { UserData } from '../../models/user-data';

// test('Register then Login', async ({ page }) => {

//   const email = faker.internet.email().toLowerCase();
//   const password = 'tester!3';

//   const registerPage = new RegisterPage(page);
//   const loginPage = new LoginPage(page);

//   // Register
//   await registerPage.goto();

//   await registerPage.register(
//     email,
//     password,
//     faker.person.fullName(),
//     faker.string.numeric(12),
//     faker.company.name(),
//     'ecommerce',
//     '11-50'
//   );

//   // Logout (jika ada)
//   await page.locator('button').filter({hasText: email}).click();
//   await page.getByRole('menuitem', { name: 'Logout' }).click();
  
//   // tunggu redirect selesai
//   await page.waitForURL('**/login'); 


//   // Login
//   await loginPage.goto();
//   await loginPage.login(email, password);
//   console.log('Current URL:', await page.url());

//   await page.waitForTimeout(5000);
//   console.log('URL after 5s:', await page.url());

//   await page.screenshot({
//   path: 'after-5-seconds.png',
//   fullPage: true
// });
//   await loginPage.verifyLoginSuccess();
// });

