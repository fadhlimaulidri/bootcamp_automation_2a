import { Page, expect } from '@playwright/test';

export class LoginAgentQPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(){
    await this.page.goto('/login'); 
    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string) {
    // Kembali menggunakan metode standar Playwright
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }
  
  async verifyLoginSuccess() {
    await expect(this.page.getByRole('heading', { name: 'Welcome to Emra! 🎉', exact: true })).toBeVisible();
  }

  async verifyInvalidCredentials() {
    await expect(this.page.getByText('Invalid credentials')).toBeVisible();
  }
}