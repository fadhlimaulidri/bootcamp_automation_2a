import { test } from '@playwright/test';
import { RegisterPage } from '../../../pages/register/register.page';
import { LoginPage } from '../../../pages/login/login.page';
import { UserFactory } from '../../../utils/user-factory';

test('Register then Login', async ({ page }) => {

  const user = UserFactory.createUser();
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);

  await registerPage.goto();
  await registerPage.register(user);
  await registerPage.verifyRegisterSuccess();
  await registerPage.logout(user.email);

  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await loginPage.verifyLoginSuccess();
});

