import { test, expect } from '@playwright/test';
import { auth, getAccounts } from '../../helper/api-helpers';
import userData from '../../data/production/user.json'
import UserResponseSchema from '../../json-schema/user-response-schema.json';
const { Validator } = require('jsonschema');

test('User successfully logged in using valid credential @api @login @p0 @smoketest', async ({ request }) => {
  // precondition
  const baseURL = process.env.API_BASE_URL || 'https://api.emra.chat';
  const email = userData['valid_user']['email']
  const password = userData['valid_user']['password']
    
  //step
  const access_token = await auth(request, baseURL, email, password);
  const response = await getAccounts(request, baseURL, access_token);
  console.log(await response.json())
  
  // expected result
  expect(response.status()).toBe(200);

  const data = await response.json();
  const validator = new Validator();
  const result = validator.validate(data, UserResponseSchema);
  expect(result.errors).toHaveLength(0); // ⬅ Kontrak HARUS terpenuhi 100%

});