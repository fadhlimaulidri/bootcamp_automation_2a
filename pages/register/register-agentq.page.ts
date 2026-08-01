import { Page, Locator, expect } from '@playwright/test';
import { UserData } from '../../models/user-data';

export class RegisterAgentQPage {
  readonly page: Page;

  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly confirmPasswordField: Locator;

  readonly fullNameField: Locator;
  readonly phoneNumberField: Locator;

  readonly companyNameField: Locator;
  readonly industryDropdown: Locator;
  readonly companySizeDropdown: Locator;

  readonly nextButton: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailField = page.getByRole('textbox', { name: 'Email' });
    this.passwordField = page.getByRole('textbox', { name: 'Password', exact: true });
    this.confirmPasswordField = page.getByRole('textbox', { name: 'Confirm Password' });

    this.fullNameField = page.getByRole('textbox', { name: 'Full Name' });
    this.phoneNumberField = page.getByRole('textbox', { name: 'Phone Number' });

    this.companyNameField = page.getByRole('textbox', { name: 'Company Name' });
    this.industryDropdown = page.getByLabel('Industry');
    this.companySizeDropdown = page.getByLabel('Company Size');

    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
  }

  async goto() {
    await this.page.goto('/signup');
  }

  // --- KODE PECALAHAN (Dipakai eceran untuk test negatif) ---
  async fillStep1(email: string, pass: string, confirmPass: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(pass);
    await this.confirmPasswordField.fill(confirmPass);
  }

  async fillStep2(fullName: string, phoneNumber: string) {
    await this.fullNameField.fill(fullName);
    await this.phoneNumberField.fill(phoneNumber);
  }

  async fillStep3(company: string, industry: string, size: string) {
    await this.companyNameField.fill(company);
    await this.industryDropdown.selectOption(industry);
    await this.companySizeDropdown.selectOption(size);
    await this.createAccountButton.click();
  }

  // --- FUNGSI NAVIGASI ---
  async clickNext() {
    await this.nextButton.click();
  }

  // --- KODE UTAMA ---
  async register(user: UserData) {
    await this.fillStep1(user.email, user.password, user.password);
    await this.clickNext();

    await this.fillStep2(user.fullName, user.phoneNumber);
    await this.clickNext();

    await this.fillStep3(user.companyName, user.industry, user.companySize);
  }

  // --- VALIDASI / ASSERTION ---
  async verifyErrorMessageIsVisible(errorMessage: string) {
    await expect(this.page.getByText(errorMessage)).toBeVisible();
  }

  async verifyRegisterSuccess() {
    await expect(this.page.getByRole('heading', { name: 'Emra', exact: true })).toBeVisible();
  }

  // --- TEARDOWN ---
  async logout(email: string) {
    await this.page.locator('button').filter({ hasText: email }).click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await this.page.waitForURL('**/login');
  }
}