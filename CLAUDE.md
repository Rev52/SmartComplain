@AGENTS.md
# Project Overview: SmartComplain
SmartComplain adalah platform pengaduan fasilitas publik modern berbasis web untuk warga Surabaya. Platform ini memungkinkan warga untuk melaporkan kerusakan fasilitas umum secara cepat, transparan, dan mudah dipantau.

## Core Technologies
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React / Heroicons (atau sesuaikan dengan preferensi)
- **Charts:** Recharts / Chart.js (untuk visualisasi statistik laporan)
- **State Management:** React Hooks (useState, useContext) & URL Search Params untuk state navigasi ringan.

## Directory Structure & Routing Strategy
Proyek ini menggunakan fitur Route Groups `(...)` dari Next.js App Router untuk memisahkan layout tanpa memengaruhi URL.
- `src/app/page.tsx`: Landing Page publik.
- `src/app/(auth)/*`: Halaman login dan register (Layout tanpa Sidebar).
- `src/app/(dashboard)/*`: Halaman internal pengguna (Menggunakan layout dengan Sidebar & Topbar).
- `src/components/ui/*`: Reusable UI components (Button, Input, Card, Badge).
- `src/components/layout/*`: Komponen struktural (Sidebar, Topbar, Navbar, Footer).

## UI/UX & Design Guidelines
Desain mengutamakan tampilan yang bersih, profesional, dan mudah dinavigasi.
- **Primary Color:** Biru Navy (Navy Blue) sebagai warna identitas utama (misal: Sidebar, tombol primary, header banner).
- **Background Color:** Putih keabu-abuan / Light Gray (misal: `#F3F4F6` atau `bg-slate-50`) untuk membedakan dengan background Card putih solid.
- **Cards & Containers:** Gunakan background putih (`bg-white`), sudut melengkung (`rounded-xl` atau `rounded-2xl`), dan shadow lembut (`shadow-sm` atau `shadow-md`).
- **Typography:** Gunakan font Sans-Serif modern (seperti Inter atau Roboto) yang rapi.
- **Feedback & Status Badges:**
  - Selesai / Berhasil: Hijau
  - Dalam Proses: Kuning / Oranye
  - Ditolak / Error: Merah
  - Info / Draft: Biru muda atau Abu-abu

## Coding Conventions & Rules
1. **TypeScript First:** Selalu gunakan TypeScript. Hindari penggunaan `any`. Buat interface/tipe data yang jelas di folder `src/types/` untuk `User`, `Laporan`, dll.
2. **Server vs Client Components:** - Gunakan Server Components secara default untuk performa maksimal.
   - Tambahkan direktif `"use client"` di bagian atas file *hanya* jika komponen membutuhkan interaktivitas (seperti `onClick`, form state, hooks, atau rendering chart).
3. **Component Modularity:** Jaga agar komponen tetap ringkas. Jika sebuah file page terlalu panjang, pecah bagian-bagiannya (seperti Form Buat Laporan atau List Laporan) menjadi komponen terpisah di `src/components/`.
4. **Tailwind Best Practices:** Gunakan utility class Tailwind secara langsung. Jika class terlalu panjang atau ada logika conditional styling, gunakan helper function seperti `clsx` atau `tailwind-merge` (biasanya dalam utility `cn`).
5. **Image Handling:** Selalu gunakan komponen `<Image />` bawaan Next.js dari `next/image` untuk optimasi aset gambar dan ilustrasi.

## AI Assistant Instructions
- Ketika diminta untuk membuat komponen baru, selalu cek apakah ada komponen UI (seperti `Button` atau `Card`) yang sudah ada dan bisa di-reuse.
- Berikan respons berupa kode yang ringkas dan fungsional.
- Jika membuat *mock data* untuk laporan, gunakan konteks kota Surabaya (contoh jalan: Jl. Darmo, Jl. Jagir Wonokromo, dll).
- Prioritaskan *accessibility* (aria-labels) pada elemen form dan tombol.