import { type Locator, type Page } from '@playwright/test';

export class AddContactPage {
  readonly page: Page;
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly phoneField: Locator;
  readonly createContactButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameField = page.locator("//input[@placeholder='Enter full name']");
    this.emailField = page.locator("//input[@placeholder='Enter email address']");
    this.phoneField = page.locator("//input[@placeholder='Phone number']");
    this.createContactButton = page.getByRole('button', { name: 'Create Contact' });
  }

  async goto() {
    await this.page.goto('/contacts/add');
  }

  async fillContactForm(name: string, email: string, phone: string) {
    await this.nameField.fill(name);
    await this.emailField.fill(email);
    await this.phoneField.fill(phone);
  }

  async createContact(name: string, email: string, phone: string) {
    await this.fillContactForm(name, email, phone);
    await this.createContactButton.click();
  }
}
