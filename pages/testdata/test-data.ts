import jsonData from '../../data/staging/user.json'; // Sesuaikan folder arah ke data.json kamu

export const testData = {
  ...jsonData, 
  login: {
    ...jsonData.login,
    valid: {
      // Di sini data dinamis .env dimasukkan dengan aman
      email: process.env.VALID_EMAIL as string,
      password: process.env.VALID_PASSWORD as string
    }
  }
};