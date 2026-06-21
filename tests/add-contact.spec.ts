import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { AddContactPage } from '../pages/add-contact.page';
import userData from '../data/production/user.json';
import { pushTestResultToAgentQ } from '../helper/agentq-helper';

test.describe('Add Contact Tests', () => {
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

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(
      userData.valid_user.email,
      userData.valid_user.password
    );
    await expect(page).toHaveURL(/\/(dashboard|home|$)/, { timeout: 10000 });
  });

  test('1-Navigate to Add Contact page and verify form is displayed @p0 @contact @positive', async ({ page }) => {
    const addContactPage = new AddContactPage(page);
    await addContactPage.goto();

    await expect(addContactPage.nameField).toBeVisible();
    await expect(addContactPage.emailField).toBeVisible();
    await expect(addContactPage.phoneField).toBeVisible();
    await expect(addContactPage.createContactButton).toBeVisible();
  });

  test('2-Create contact with valid data @p0 @contact @positive', async ({ page }) => {
    const addContactPage = new AddContactPage(page);
    await addContactPage.goto();

    const timestamp = Date.now();
    const contactName = 'Test';
    const contactEmail = `qa-${timestamp}@yopmail.com`;
    const contactPhone = '08123456789';

    await addContactPage.addContact(contactName, contactEmail, contactPhone);

    await expect(page).toHaveURL(/\/contacts/, { timeout: 10000 });
  });

  test('3-Create contact with empty name should show validation @p1 @contact @negative', async ({ page }) => {
    const addContactPage = new AddContactPage(page);
    await addContactPage.goto();

    const timestamp = Date.now();
    await addContactPage.addContact('', `qa-${timestamp}@yopmail.com`, '08123456789');

    await expect(page).toHaveURL(/\/contacts\/add/, { timeout: 5000 });
  });

  test('4-Create contact with empty email should show validation @p1 @contact @negative', async ({ page }) => {
    const addContactPage = new AddContactPage(page);
    await addContactPage.goto();

    await addContactPage.addContact('Test', '', '08123456789');

    await expect(page).toHaveURL(/\/contacts\/add/, { timeout: 5000 });
  });

  test('5-Create contact with empty phone should show validation @p1 @contact @negative', async ({ page }) => {
    const addContactPage = new AddContactPage(page);
    await addContactPage.goto();

    const timestamp = Date.now();
    await addContactPage.addContact('Test', `qa-${timestamp}@yopmail.com`, '');

    await expect(page).toHaveURL(/\/contacts\/add/, { timeout: 5000 });
  });
});
