# 📍 FE Entity Info — Entity Tracking & Map Management

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Rspack](https://img.shields.io/badge/Bundler-Rspack-D85480?style=flat-square&logo=webpack&logoColor=white)](https://rspack.rs/)
[![Leaflet](https://img.shields.io/badge/Map-Leaflet-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

Aplikasi frontend modern untuk visualisasi lokasi dan manajemen data entitas secara real-time. Terhubung langsung dengan backend REST API Go Gin (`be-entity-info`) dan database PostgreSQL.

👨‍💻 **Maintained by:** **Muhammad Rifky Janzani**

---

## 🚀 1. Cara Menjalankan Program

### Prasyarat

- **Node.js** (≥ v20.x)
- **pnpm** (≥ v9.x)
- **Docker & Docker Compose** (opsional untuk mode container)

---

### Opsi A: Menjalankan di Local (Development Mode)

1. **Salin file environment:**

   ```bash
   cp .env.example .env
   ```

2. **Install dependensi:**

   ```bash
   pnpm install
   ```

3. **Jalankan local dev server:**

   ```bash
   pnpm run dev
   ```

4. Buka browser pada alamat:
   👉 **`http://localhost:8123`**

---

### Opsi B: Menjalankan dengan Docker

1. **Build dan jalankan container:**

   ```bash
   docker compose up --build -d
   ```

2. **Periksa status container:**

   ```bash
   docker compose ps
   ```

3. Buka browser pada alamat:
   👉 **`http://localhost:8123`**

4. **Menghentikan container:**
   ```bash
   docker compose down
   ```
---

## 🛠️ 2. Alasan Pemilihan Library

| Library / Tool                   | Alasan Pemilihan                                                                                                                                                                                            |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Leaflet & OpenStreetMap**      | Map _open-source_, gratis, dan **bebas API key/watermark**. Sangat fleksibel untuk _custom HTML marker_, kontrol kamera (_flyTo/fitBounds_), dan interaksi klik untuk memilih titik koordinat. |
| **React 18 & TypeScript**        | Standar untuk pengembangan antarmuka modular, performa render optimal, dan _type-safety_ ketat yang mencegah kesalahan tipe data pada koordinat serta atribut entitas.                             |
| **Rspack**                       | Bundler berbasis Rust berkecepatan tinggi dengan waktu kompilasi di bawah 1 detik, mendukung _Hot Module Replacement (HMR)_ instan dan konfigurasi yang efisien.                                            |
| **Tailwind CSS**                 | Menyediakan styling berbasis utility-first yang cepat dan konsisten untuk tema gelap (_dark theme_) yang menyatu dengan tampilan peta.                                                                      |
| **Axios**                        | HTTP client andal dengan interceptor dan error handling yang terstruktur untuk menangkap validasi error HTTP 400 dari backend secara presisi.                                                               |
| **Jest & React Testing Library** | Framework unit test untuk menguji state management.                                                           |
| **Nginx (Alpine)**               | Web server produksi dalam container Docker yang sangat ringan (< 30 MB), mendukung _SPA routing fallback_, dan kompresi `gzip`.                                                                             |

---

## 🤖 3. Workflow Penggunaan Agentic AI

Pada pengerjaan project ini, **Agentic AI** diterapkan sebagai **Pair-Programming Partner** dengan batasan alur kerja sebagai berikut:

1. **Peran Human Engineer (Lead / Architect)**:
   - Menetapkan kebutuhan fungsional dan _constraints_ arsitektur (misal: penanganan CORS, pemilihan library peta bebas API key, arsitektur state tanpa data dummy lokal).
   - Mengarahkan perbaikan UX (kamera zoom yang seimbang, auto-fit bounding box pada filter, interaksi klik titik peta).
   - Memvalidasi kualitas kode, integritas build, dan hasil pengujian akhir.

2. **Peran Agentic AI**:
   - Menulis implementasi modul secara otonom (_service client_, custom hook, komponen peta Leaflet, modal form).
   - Menyusun dan menjalankan unit test komprehensif (39 unit tests).
   - Mendiagnosis dan menyelesaikan error kompilasi, peringatan DOM, serta konfigurasi multi-stage Docker.

> 📖 _Dokumentasi lengkap mengenai keputusan arsitektur (ADR) dan audit kolaborasi Agentic AI dapat dilihat pada file [AGENT.md](./AGENT.md)._

---

## 📬 Kontak

- 👤 **Muhammad Rifky Janzani**
- 📧 **Email:** [muhammadrifkyjanzani@gmail.com](mailto:muhammadrifkyjanzani@gmail.com)
- 🔗 **LinkedIn:** [linkedin.com/in/mrjanzani](https://www.linkedin.com/in/mrjanzani/)
