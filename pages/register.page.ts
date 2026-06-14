import { type Locator, type Page } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly confirmpasswordField: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.locator('#email')
    this.passwordField = page.locator('#password');
    this.confirmpasswordField = page.getByRole('button', { name: 'Sign In' });
    this.nextButton = page.getByRole('link', { name: 'Forgot?' });
  }

  async goto() {
    await this.page.goto('https://www.emra.chat/login');
  }

  async loginAs(email: string, password: string) {
    await this.emailField.click();
    await this.emailField.fill(email);
    // await this.passwordField.first().click()
    await this.emailField.press('Tab');
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}
