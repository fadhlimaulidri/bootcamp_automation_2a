import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';

test('berhasil membuat user register', async ({ page }) => {
  await page.goto('https://www.emra.chat/signup');
  const registerPage=new RegisterPage(page)
  await registerPage.emailField.fill("ghalib@gmail.com")
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('kawakibi@gmaill.com');
  await page.getByRole('textbox', { name: 'Password', exact: true }).click();
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('kawakibi123!@#');
  await page.getByRole('textbox', { name: 'Confirm Password' }).click();
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('kawakibi123!@#');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).fill('kawakibi');
  await page.getByRole('textbox', { name: 'Phone Number' }).click();
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('81212803838');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Company Name' }).click();
  await page.getByRole('textbox', { name: 'Company Name' }).fill('kawakibi');
  await page.getByLabel('Industry').selectOption('retail');
  await page.getByLabel('Company Size').selectOption('51-200');
  await page.getByRole('button', { name: 'Create Account' }).click();
});