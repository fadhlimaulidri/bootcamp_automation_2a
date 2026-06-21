import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { AddContactPage } from '../pages/add-contact.page';
import userData from '../data/production/user.json'
import { pushTestResultToAgentQ } from '../helper/agentq-helper';

test.describe('Contact Management Tests', () => {
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

  test('10-User successfully add contact using valid data @p0 @contact @positive @smoketest', async ({ page }) => {
    const email = userData['valid_user']['email']
    const password = userData['valid_user']['password']

    // Precondition: User login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(email, password);

    // Step 1: Go to add contact page
    const addContactPage = new AddContactPage(page);
    await addContactPage.goto();

    // Step 2: Verify contact page is displayed
    await expect(addContactPage.nameField).toBeVisible();
    await expect(addContactPage.emailField).toBeVisible();
    await expect(addContactPage.phoneField).toBeVisible();
    await expect(addContactPage.createContactButton).toBeVisible();

    // Step 3: Fill contact form with dummy data
    const timestamp = Date.now();
    const contactName = `Test ${timestamp}`;
    const contactEmail = `qa-${timestamp}@yopmail.com`;
    const contactPhone = `0812${timestamp.toString().slice(-8)}`;

    await addContactPage.createContact(contactName, contactEmail, contactPhone);

    // Expected: Contact successfully created
    await expect(page).toHaveURL(/\/contacts/, { timeout: 10000 });
  });
});
