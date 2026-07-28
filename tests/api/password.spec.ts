import { test, expect } from '@playwright/test';
import { auth, changePassword } from '../../helper/api-helpers';
import userData from '../../data/production/user.json';
import PasswordResponseSchema from '../../json-schema/password-response-schema.json';
import { pushTestResultToAgentQ } from '../../helper/agentq-helper';
const { Validator } = require('jsonschema');

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

test('20-User successfully change password using valid data on all fields @api @p1 @tugasbesar', async ({ request }) => {
  const baseURL = process.env.API_BASE_URL || 'https://api.emra.chat';
  const email = userData["valid_user"].email;
  const password = userData["valid_user"].password;

  const access_token = await auth(request, baseURL, email, password);
  const current_password = userData["valid_password_change"].current_password;
  const new_password = userData["valid_password_change"].new_password;
  const password_confirmation = userData["valid_password_change"].password_confirmation;

  const response = await changePassword(request, baseURL, access_token, current_password, new_password, password_confirmation);

  console.log(await response.json());

  expect(response.status()).toBe(200);

  const data = await response.json();
  const validator = new Validator();
  const result = validator.validate(data, PasswordResponseSchema);

  expect(result.errors).toHaveLength(0);
});

});