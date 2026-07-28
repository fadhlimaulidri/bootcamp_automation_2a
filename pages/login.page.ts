import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly forgotLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.locator("//input[@placeholder='you@example.com']")
    this.passwordField = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Sign In' })
    this.forgotLink = page.getByRole('link', { name: 'Forgot?' });
  }

  async goto() {
    // await this.page.goto('/login'); --> because of URL is located on .env file and not push to github, the testing is error
    await this.page.goto('https://www.emra.chat/login'); // changes from Putri due to the .env file cannot be accessed by playwright test, so I hardcode the URL here
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
