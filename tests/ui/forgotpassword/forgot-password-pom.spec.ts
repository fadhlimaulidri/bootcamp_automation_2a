import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../../../pages/password/forgot-password.page';
import testData from '../../../data/staging/user.json'

test.describe('Forgot Password - POM Version', () => {
  let forgotPasswordPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.navigateToForgotPage();
  });

  test('1-Password reset with a valid, registered email @positive', async () => {
    await forgotPasswordPage.requestPasswordReset(testData.forgotPassword.validEmail);
    await expect(forgotPasswordPage.successNotification).toBeVisible();
  });

  test('2-Password reset with an unregistered email @positive', async () => {
    await forgotPasswordPage.requestPasswordReset(testData.forgotPassword.unregisteredEmail);
    await expect(forgotPasswordPage.successNotification).toBeVisible();
  });

  test('3-Password reset with an invalid email format @negative', async () => {
    await forgotPasswordPage.requestPasswordReset(testData.forgotPassword.invalidFormatEmail);

    const errorMessage = await forgotPasswordPage.getHtml5ValidationMessage();
    expect(errorMessage).toContain("Please include an '@' in the email address");
  });

  test('4-Password reset with a blank email field @negative', async () => {
    // Kirim string kosong untuk mensimulasikan field kosong
    await forgotPasswordPage.requestPasswordReset('');

    const errorMessage = await forgotPasswordPage.getHtml5ValidationMessage();
    expect(errorMessage).toBe("Please fill out this field.");
  });

})






