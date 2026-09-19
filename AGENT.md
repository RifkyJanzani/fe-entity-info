# AGENT.md — Agentic AI Collaboration & Architecture Guidelines

Dokumen ini menjelaskan penerapan **Agentic AI** dalam pengembangan frontend **`fe-entity-info`**, arsitektur sistem, keputusan teknis (_Architectural Decision Records_), panduan kualitas kode, serta alur kerja kolaboratif antara software engineer dan AI coding agent.

---

## 1. 🤖 Overview & Collaboration Model

Pengembangan repositori `fe-entity-info` memanfaatkan alur kerja **Agentic AI pair-programming** dengan pembagian peran:

| Peran                                 | Tanggung Jawab                                                                                                                                                                    |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Human Engineer (Lead / Architect)** | Mengarahkan kebutuhan produk, menetapkan _constraints_ arsitektur, mendikte pengalaman pengguna (UX), me-review perubahan secara kritis, dan melakukan pengujian akhir.           |
| **Agentic AI (Development Partner)**  | Mengimplementasikan kode program secara mandiri (_end-to-end_), melakukan refactoring, menyusun unit test, memperbaiki error build/linter, dan mengonfigurasi Docker environment. |

---

## 2. 🏛️ Key Architectural Decisions (ADR)

Berikut adalah ringkasan keputusan arsitektural utama yang disepakati dan diimplementasikan:

### ADR-01: Map Provider & Visualization Engine

- **Keputusan**: Menggunakan library **Leaflet** (`v1.9.4`) dengan provider tile **OpenStreetMap** dan styling dark theme via CSS filter (`.map-tiles-dark`).
- **Rasional**:
  - OpenStreetMap 100% open-source, stabil, dan **tidak memerlukan API key** atau memunculkan watermark berbayar (seperti CartoDB).
  - Leaflet memberikan kontrol penuh atas custom DOM marker (`L.divIcon`), kamera interaktif (`flyTo`/`fitBounds`), dan event listener klik geospasial.

### ADR-02: State Management & Empty State Strategy

- **Keputusan**: Menggunakan arsitektur berbasis _Custom Hook_ terpusat ([src/hooks/useEntityDashboard.ts](file:///src/hooks/useEntityDashboard.ts)) dan Axios client ([src/services/entityService.ts](file:///src/services/entityService.ts)).
- **Rasional**:
  - **Clean Initial State**: Menghapus seluruh data _dummy_ statis lokal saat inisialisasi agar frontend murni merefleksikan status database backend secara transparan.
  - **Inline Error Mapping**: Menangkap respons error validasi HTTP 400 dari backend Go Gin dan memetakannya langsung ke helper text input form yang bersangkutan.

### ADR-03: Geospatial UX Enhancements

- **Keputusan**:
  1. **Dynamic Marker by Status**: Marker pin dengan warna dinamis sesuai status operasi entitas (Active: `#4F9669`, Idle: `#D7C525`, Maintenance: `#3575F3`, Offline: `#C13B3B`).
  2. **Balanced Camera FlyTo**: Menggunakan tingkat zoom level `10` saat memilih entitas agar fokus tetapi tetap mempertahankan konteks wilayah sekitar.
  3. **Smart Filter Auto-Fit**: Saat dropdown filter _Type_ atau _Status_ dipilih, kamera otomatis menghitung _bounding box_ seluruh entitas yang sesuai dan memposisikan peta agar semua titik tampak di layar.
  4. **Coordinate Picking**: Mengklik titik mana pun di peta otomatis mengisi input latitude & longitude pada formulir pembuatan entitas.
  5. **Anti-Flicker Architecture**: Mengunci inisialisasi instance Leaflet (`useRef`) dan memanfaatkan `useCallback` + `React.memo` agar pengetikan pada form tidak memicu re-render / kedipan pada peta.

### ADR-04: Containerization & SPA Routing

- **Keputusan**: Multi-stage Docker build menggunakan `node:20.9.0-alpine` (builder) dan `nginx:1.25.5-alpine` (runtime web server).
- **Rasional**:
  - Menghasilkan image produksi yang sangat ringan (< 30 MB).
  - Konfigurasi Nginx SPA (`try_files $uri $uri/ /index.html`) dengan kompresi `gzip` dan header anti-stale caching yang aman.

---

## 3. 📂 Struktur Repositori

```
fe-entity-info/
├── config/
│   └── nginx.conf              # Konfigurasi Nginx untuk Docker container
├── src/
│   ├── common/                 # Reusable UI primitives (Button, Card, PopUp, Input, etc.)
│   ├── components/
│   │   ├── EntityDashboard.tsx # Layout utama dashboard
│   │   └── entity-management/  # Komponen fitur (EntityMap, EntityList, EntityDetails, EntityFormModal)
│   ├── domain/
│   │   └── geospatial-entity.ts# Kontrak tipe DTO & schema domain geospasial
│   ├── hooks/
│   │   ├── useEntityDashboard.ts      # Custom hook state & sinkronisasi API
│   │   └── useEntityDashboard.test.ts # Unit test state management
│   ├── services/
│   │   ├── entityService.ts    # Axios REST API client
│   │   └── entityService.test.ts# Unit test API integration
│   ├── utils/
│   │   └── entity-management.ts# Helper format koordinat, tanggal, & validasi
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Tailwind layer & styling Leaflet dark mode
├── Dockerfile                  # Multi-stage production container
├── docker-compose.yaml         # Compose file untuk menjalankan service
├── rspack.config.ts            # Konfigurasi Rspack bundler & module federation
└── package.json
```

---

## 4. 🛠️ Panduan Operasional & Perintah Pengujian

Bagi pengembang maupun agent AI yang mengelola repositori ini di masa mendatang, berikut adalah perintah baku yang wajib dijalankan:

### Menjalankan Lingkungan Lokal

```bash
pnpm install
pnpm run dev
```

### Menjalankan Pengujian (Unit Tests)

```bash
pnpm test
```

_Catatan: Seluruh 5 test suite (39 unit tests) wajib berstatus **PASS (100%)** sebelum melakukan commit._

### Menjalankan Linter & Formatter

```bash
pnpm run format-lint
```

### Memverifikasi Build Produksi

```bash
pnpm run build
```

### Menjalankan via Docker

```bash
docker compose up --build -d
docker compose ps
docker compose down
```

---

## 5. 📜 Aturan Pengembangan untuk Agen AI (Agent Guidelines)

1. **Dokumentasi & Integritas Kode**: Pertahankan tipe data TypeScript yang ketat (_no implicit any_) dan dokumentasi JSDoc pada setiap komponen dan fungsi baru.
2. **Prinsip Minimalis (Anti Over-Engineering)**: Jangan menambahkan dependensi besar jika kebutuhan dapat diselesaikan menggunakan library bawaan atau utilitas standar.
3. **Kualitas Verifikasi**: Setiap perubahan fungsional harus divalidasi dengan unit test Jest (`*.test.ts` / `*.test.tsx`) dan dipastikan lulus `pnpm run format-lint` tanpa error/warning.
4. **Konsistensi Estetika**: Pertahankan tema gelap (_dark theme_) dengan palet warna status yang seragam di seluruh peta, badge, dan modal.
