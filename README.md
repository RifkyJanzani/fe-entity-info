# FE Entity Info (Frontend Geospatial Entity Management)

Frontend web application modern berbasis React 18, TypeScript, Rspack, Tailwind CSS, dan Leaflet untuk visualisasi dan manajemen entitas geospasial real-time yang terintegrasi dengan backend REST API Go Gin (`be-entity-info`).

---

## 🚀 Fitur Utama

- 🗺️ **Peta Interaktif Geospasial (Leaflet + OpenStreetMap)**:
  - Custom SVG pin marker dengan pewarnaan dinamis sesuai status entitas (Active, Idle, Maintenance, Offline).
  - Animasi pulsating aura ring pada entitas yang sedang dipilih.
  - Kamera interaktif halus (_flyTo/panTo_) dengan tingkat zoom seimbang.
  - Auto-fit bounding box kamera saat menerapkan filter jenis/status.
  - _Pick Coordinates_: Klik langsung di peta untuk otomatis mengisi koordinat di form input.
- 📋 **Roster & Manajemen Entitas (CRUD)**:
  - Pencarian real-time berdasarkan nama entitas.
  - Filter interaktif berdasarkan tipe/kategori (_Kind_) dan status operasi.
  - Formulir validasi inline (HTTP 400 error mapping dari backend).
- 📊 **Metrik Agregat**:
  - Statistik total entitas, status aktif, offline, dan fasilitas.

---

## 🛠️ Tech Stack

- **Framework & Runtime**: React 18, TypeScript, Rspack
- **Styling**: Tailwind CSS, CSS Custom Tokens (Dark Theme)
- **Map Engine**: Leaflet, OpenStreetMap Tile Layer
- **State & HTTP**: React Hooks, Axios
- **Web Server (Docker)**: Nginx 1.25 Alpine (SPA routing & gzip compression)

---

## ⚙️ Environment Variables

Buat file `.env` berdasarkan template [.env.example](file:///.env.example):

```env
SERVICE_NAME=FE_ENTITY_INFO
SERVICE_NAME_DOCKER=fe-entity-info
BUILD_TAG=latest
PORT=8123
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 💻 Cara Menjalankan

### Opsi 1: Menjalankan di Local (Development Mode)

1. **Install dependensi**:

   ```bash
   pnpm install
   ```

2. **Jalankan dev server**:

   ```bash
   pnpm run dev
   ```

3. Buka browser pada **`http://localhost:8123`**.

---

### Opsi 2: Menjalankan dengan Docker / Docker Compose

1. **Build dan jalankan container**:

   ```bash
   docker compose up --build -d
   ```

2. **Periksa status container**:

   ```bash
   docker compose ps
   ```

3. Buka browser pada **`http://localhost:8123`**.

4. **Menghentikan container**:
   ```bash
   docker compose down
   ```

---

## 📜 Script Perintah

| Perintah               | Deskripsi                                                        |
| ---------------------- | ---------------------------------------------------------------- |
| `pnpm run dev`         | Menjalankan local dev server dengan HMR (Hot Module Replacement) |
| `pnpm run build`       | Melakukan build bundle production dengan Rspack                  |
| `pnpm test`            | Menjalankan seluruh test suite Jest unit testing                 |
| `pnpm run format-lint` | Melakukan code formatting (Prettier) dan linting (ESLint)        |
| `pnpm run lint:fix`    | Memperbaiki error linting secara otomatis                        |

---

## 🧪 Pengujian & Kualitas Kode

```bash
# Menjalankan unit test
pnpm test

# Menjalankan format & lint check
pnpm run format-lint
```
