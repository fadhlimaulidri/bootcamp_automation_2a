import { Page, Locator, expect } from '@playwright/test';

export class ForgotPasswordPage {
  readonly page: Page;
  readonly forgotLink: Locator;
  readonly emailField: Locator;
  readonly resetButton: Locator;
  readonly successNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators yang ada di halaman Login & Forgot Password
    this.forgotLink = page.getByRole('link', { name: 'Forgot?' });
    this.emailField = page.getByRole('textbox', { name: 'Email' });
    this.resetButton = page.getByRole('button', { name: 'Reset Password' });
    this.successNotification = page.getByText('Reset instructions sent!');
  }

  async navigateToForgotPage() {
    await this.page.goto('/login');
    await this.forgotLink.click();
  }

  async requestPasswordReset(email: string) {
    if (email) {
      await this.emailField.fill(email);
    }
    await this.resetButton.click();
  }

  async triggerConsecutiveResets(email: string) {
    await this.emailField.fill(email);
    await this.resetButton.click();
    await this.resetButton.click({ clickCount: 2 }); // Simulasi spam klik otomatis
  }

  async getHtml5ValidationMessage(): Promise<string> {
    return await this.emailField.evaluate((element: HTMLInputElement) => element.validationMessage);
  }
}