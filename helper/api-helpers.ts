
export async function auth(request: APIRequestContext, baseURL: string, email: string, password: string ): Promise<string> {
  const response = await request.post(`${baseURL}/api/v1/auth/login`, {
    data: { auth: { email, password } },
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  });

  if (response.status() !== 200) {
    throw new Error(`Login failed: ${response.status()}`);
  }

  const body = await response.json();
  return body.data.tokens.access_token; // Return JWT string
}

export async function getAccounts(request: APIRequestContext, baseURL: string, access_token: string): Promise<string> {
  const response = await request.get(`${baseURL}/api/v1/user`, {
      headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json',
          'Authorization': `Bearer ${access_token}` 
      }
    });
  
  
  // const body = await response.json();
  return response; // Return JWT string
}

export async function changePassword(
  request: APIRequestContext,
  baseURL: string,
  access_token: string,
  current_password: string,
  new_password: string,
  password_confirmation: string
): Promise<string> {
  const response = await request.post(`${baseURL}/api/v1/auth/change_password`, {
    data: { auth: { current_password, new_password, password_confirmation } },
    headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
    }
  });

//   const body = await response.json();
  return response; // Return JWT string
}