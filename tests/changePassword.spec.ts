import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ChangePasswordPage } from '../pages/changePassword.page';
import userData from '../data/production/user.json';
import { pushTestResultToAgentQ } from '../helper/agentq-helper'; 

test.describe('Authentication Tests', () => {
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

 test('12-User successfully change password using valid data on all fields @p0 @positive @tugasbesar', async ({ page }) => {
      const email = userData["valid_user"].email;
      const password = userData["valid_user"].password;
      const loginPage = new LoginPage(page);

      // precondition
      await loginPage.goto();
      await loginPage.loginAs(email, password);
      await expect(page.getByRole('heading', { name: 'Welcome to Emra! 🎉' })).toBeVisible();

      // steps
      const changePasswordPage = new ChangePasswordPage(page);

      await changePasswordPage.goto();
      const currentPassword = userData["valid_password_change"].current_password;
      const newPassword = userData["valid_password_change"].new_password;
      const passwordConfirmation = userData["valid_password_change"].password_confirmation;
      await changePasswordPage.changePassword(currentPassword, newPassword, passwordConfirmation);

      // expected results
      await expect(page.getByRole('textbox', { name: 'Confirm New Password' })).toHaveValue(passwordConfirmation);
      await expect(page.getByText(/Password updated.*successfully/)).toBeVisible();
  });

  test('14-User unsuccessfully change password using invalid data on Current Password @p1 @negative @tugasbesar', async ({ page }) => {
      const email = userData["valid_user"].email;
      const password = userData["valid_user"].password;
      const loginPage = new LoginPage(page);

      // precondition
      await loginPage.goto();
      await loginPage.loginAs(email, password);
      await expect(page.getByRole('heading', { name: 'Welcome to Emra! 🎉' })).toBeVisible();

      // steps
      const changePasswordPage = new ChangePasswordPage(page);

      await changePasswordPage.goto();
      const currentPassword = userData["invalid_current_password_change"].current_password;
      const newPassword = userData["invalid_current_password_change"].new_password;
      const passwordConfirmation = userData["invalid_current_password_change"].password_confirmation;
      await changePasswordPage.changePassword(currentPassword, newPassword, passwordConfirmation);
      
      // expected results
      await expect(page.getByRole('textbox', { name: 'Confirm New Password' })).toHaveValue(passwordConfirmation);
      await expect(page.getByText(/Current password.*is incorrect/)).toBeVisible();
  });

  test('15-User unsuccessfully change password using mismatch data between New Password and Confirm New Password @p1 @negative @tugasbesar', async ({ page }) => {
      const email = userData["valid_user"].email;
      const password = userData["valid_user"].password;
      const loginPage = new LoginPage(page);

      // precondition
      await loginPage.goto();
      await loginPage.loginAs(email, password);
      await expect(page.getByRole('heading', { name: 'Welcome to Emra! 🎉' })).toBeVisible();
      
      // steps
      const changePasswordPage = new ChangePasswordPage(page);

      await changePasswordPage.goto();

      const currentPassword = userData["mismatch_password_change"].current_password;
      const newPassword = userData["mismatch_password_change"].new_password;
      const passwordConfirmation = userData["mismatch_password_change"].password_confirmation;
      await changePasswordPage.changePassword(currentPassword, newPassword, passwordConfirmation);

      // expected results
      await expect(page.getByRole('textbox', { name: 'Confirm New Password' })).toHaveValue(passwordConfirmation);
      await expect(page.getByText(/New passwords.*do not match/)).toBeVisible();
  });

});