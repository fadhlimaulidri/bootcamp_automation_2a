import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// 🟢 AKTIFKAN PENGATURAN .ENV
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  
  //   POSISI YANG BENAR: Taruh testIgnore di sini (top-level)
  testIgnore: '**/forgotpassword/**', // Sesuai dengan folder kamu: tests/forgotpassword/

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: Number(process.env.PLAYWRIGHT_RETRIES),
  workers: Number(process.env.PLAYWRIGHT_WORKERS),
  reporter: [
    ['html'], // Tetap membuat laporan web HTML seperti biasa
    ['json', { outputFile: 'playwright-report/results.json' }] // Menghasilkan file hasil.json
  ],
  timeout : 30000, //Setting timeout 30 detik

  use: {
    //  Ambil URL utama dari .env, atau jadikan emra.chat sebagai default
    baseURL: process.env.BASE_URL, 

    screenshot: 'only-on-failure', // Hanya ambil gambar saat gagal
    video: 'retain-on-failure',   // Hanya rekam video saat gagal
    trace: 'on-first-retry',   // Saat percobaan pertama
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});