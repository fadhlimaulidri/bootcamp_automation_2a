import { test, expect } from '@playwright/test';
import { testData } from '../../../pages/testdata/test-data';

test('test', async ({ page }) => {
  await page.goto('https://www.emra.chat/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(testData.login.valid.email);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Password' }).fill('S');
  await page.getByRole('textbox', { name: 'Password' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Password' }).fill(testData.login.valid.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome to Emra! 🎉' })).toBeVisible();
  await page.screenshot({path: 'screenshots/login-success.png', fullPage: true});
});

// Best Practice
test('login success use valid credential @p0 @login @smoketest', async ({ page }) => {
  // Precondition
  await page.goto('https://www.emra.chat/login');
  // Step
  await page.getByRole('textbox', {name: 'Email'}).fill(testData.login.valid.email);
  await page.getByRole('textbox', {name: 'Password'}).fill(testData.login.valid.password);
  await page.getByRole('button', {name: 'Sign In'}).click();
  // Expected Result
  await expect(page.getByRole('heading', {name: 'Welcome to Emra! 🎉',exact: true})).toBeVisible();
  await page.screenshot({path: 'screenshots/login-success.png',fullPage: true});

  });
 
test('login failed password invalid @p0 @login @smoketest', async ({ page }) => {
// Precondition
  await page.goto('https://www.emra.chat/login');
  // Step
  await page.getByRole('textbox', { name: 'Email' }).fill('nuruddinam46@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Sign In' }).click();
  // Expected Result
  await expect(page.getByText('Invalid credentials')).toBeVisible();

});

test('login failed email invalid @p0 @login @smoketest', async ({ page }) => {
  // Precondition
  await page.goto('https://www.emra.chat/login');
  // Step
  await page.getByRole('textbox', { name: 'Email' }).fill('a');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Sign In' }).click();
  // Expected Result
  const validationMessage = await page.getByRole('textbox', { name: 'Email' }).evaluate((el: HTMLInputElement) => el.validationMessage);
  expect(validationMessage).toContain("Please include an '@' in the email address. 'a' is missing an '@'.");

});

