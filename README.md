# Web UI Test Automation Framework - Playwright & TypeScript

[![Playwright](https://img.shields.io/badge/Framework-Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![AgentQ](https://img.shields.io/badge/Reporting-AgentQ-FF6B6B?style=for-the-badge)](https://agentq.id/)

Proyek ini adalah framework *Web UI Automation Testing* end-to-end yang dibangun menggunakan **Playwright** dan **TypeScript**. Framework ini dirancang dengan standar industri menggunakan **Page Object Model (POM)** dan **Factory Pattern** untuk pengelolaan data uji (*test data*), serta diintegrasikan dengan **AgentQ Dashboard API** untuk pelaporan hasil pengujian secara real-time.

---

## 🚀 Fitur & Keunggulan Framework
- **Page Object Model (POM):** Pemisahan logika elemen UI (*locators*) dan aksi (*actions*) untuk meningkatkan *reusability* dan kemudahan pemeliharaan kode.
- **Factory Pattern (UserFactory):** Pembuatan data uji pengguna secara dinamis dan unik menggunakan library Faker, mencegah duplikasi data saat pengujian registrasi.
- **Dinamis Reporting via AgentQ:** Integrasi otomatis menggunakan *hook* `afterEach` Playwright untuk mengirimkan metrik eksekusi, status (*Passed/Failed*), dan detail eror langsung ke dashboard AgentQ.
- **Multi-Environment Configuration:** Menggunakan `dotenvx` untuk manajemen *environment variables* (.env) yang aman dan fleksibel.

---

## 📂 Struktur Proyek
```text
Projek_Playwright_bc/
├── helpers/
│   └── agentq-helper.ts       # Integrasi API untuk push data ke AgentQ Dashboard
├── pages/
│   ├── login/
│   │   └── login.page.ts      # POM untuk fitur Login
│   └── register/
│       └── register-agentq.page.ts # POM untuk fitur Register
├── tests/
│   ├── login/
│   │   └── login.spec.ts      # Skrip pengujian fitur Login
│   └── register/
│       └── register-agentq.spec.ts # Skrip pengujian fitur Register
├── utils/
│   └── user-factory.ts        # Generator data uji (Factory Pattern)
├── .env                       # Environment variables (lokal)
├── playwright.config.ts       # Konfigurasi global Playwright
└── package.json               # Dependensi proyek dan custom script shortcut