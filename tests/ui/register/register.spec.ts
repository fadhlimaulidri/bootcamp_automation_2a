import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';


test('User successfullly register using valid credential', async ({ page }) => {
  const randomEmail = faker.internet.email();

  await page.goto('https://www.emra.chat/signup');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(randomEmail);
  await page.getByRole('textbox', { name: 'Password', exact: true }).click();
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('tester!3');
  await page.getByRole('textbox', { name: 'Confirm Password' }).click();
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('tester!3');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).fill('Fadhli test codegen');
  await page.getByRole('textbox', { name: 'Phone Number' }).click();
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('89690015715');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox', { name: 'Company Name' }).click();
  await page.getByRole('textbox', { name: 'Company Name' }).fill('fadhlis company');
  await page.getByLabel('Industry').selectOption('ecommerce');
  await page.getByLabel('Company Size').selectOption('11-50');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByRole('heading', { name: 'Emra', exact: true })).toBeVisible();
});