import { test } from '@playwright/test';
import { LoginPage } from '../../../pages/login/login.page';
import { testData } from '../../../pages/testdata/test-data';

//Positive TC
test('1-Login success use valid credential @p0 @login @smoketest', async ({ page }) => {
 const loginPage = new LoginPage(page)

 await loginPage.goto()
 await loginPage.emailField.fill(testData.login.valid.email);
 await loginPage.passwordField.fill(testData.login.valid.password);
 await loginPage.loginButton.click();
});

//Negative TC
test('2-Login failed email invalid @p0 @login @smoketest', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(testData.login.invalid.unregisteredEmail, testData.login.valid.password);
  await loginPage.verifyInvalidCredentials();
});


test('3-Login failed password invalid @p0 @login @smoketest', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('nuruddinam46@gmail.com','a');
  await loginPage.verifyInvalidCredentials();
});

test('4-Login failed email and password invalid @p0 @login @smoketest', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('nuruddinam@gmail.com', 'a');
  await loginPage.verifyInvalidCredentials();
});

test('5-Login failed format email invalid @p0 @login @smoketest', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('a', 'a');
  await loginPage.verifyInvalidEmailFormat();
});