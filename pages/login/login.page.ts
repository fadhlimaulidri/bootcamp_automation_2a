import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly welcomeText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.getByRole('textbox', { name: 'Email' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Sign In' });
    this.welcomeText = page.getByRole('heading', {name: 'Welcome to Emra! 🎉',exact: true});
  }

  async goto(){
    await this.page.goto('/login'); // 
    await this.page.waitForLoadState('networkidle');
    await expect(this.emailField).toBeVisible();
    await expect(this.passwordField).toBeVisible();
  }

   async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.loginButton.click();
    await this.page.waitForTimeout(3000);
    // await this.page.screenshot({path: 'after-click-login.png',fullPage: true});
  }
  
   async verifyLoginSuccess() {
    await expect(this.page.getByRole('heading', {name: 'Welcome to Emra! 🎉',exact: true})).toBeVisible();}

   async verifyInvalidCredentials() {
    await expect(this.page.getByText('Invalid credentials')).toBeVisible();}

   async getEmailValidationMessage() {
    return await this.emailField.evaluate((el: HTMLInputElement) => el.validationMessage);}

   async verifyInvalidEmailFormat() {
   const validationMessage =await this.emailField.evaluate((el: HTMLInputElement) => el.validationMessage);
   expect(validationMessage).toContain("Please include an '@' in the email address."
   );
}
}
