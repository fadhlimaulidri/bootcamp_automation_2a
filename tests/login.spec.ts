import { test, expect } from '@playwright/test';

test('Successfullly login use valid credential @p0 @login @positive @smoketest', async ({ page }) => {
  
  // precondition
  await page.goto('https://www.emra.chat/login');
  
  // Step
  await page.getByRole('textbox', { name: 'Email' }).fill('testingemrachat@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('tester!3');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Expected result
  await expect(page.getByRole('heading', { name: 'Emra', exact: true })).toBeVisible();
});

test('Unsuccessfully login use invalid credential @p1 @login @negative @smoketest', async ({ page }) => {
  await page.goto('https://www.emra.chat/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('testingemrachat@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});