# SmartComplain

Platform pengaduan fasilitas publik modern untuk warga Surabaya yang dibuat menggunakan Next.js dengan desain responsif, tampilan clean, dan fitur pelaporan digital yang mudah digunakan.

## Live Demo

Website  
Belum tersedia

Repository  
https://github.com/Rev52/SmartComplain

* * *

## Tentang Project

Project ini dibuat sebagai platform pengaduan fasilitas publik yang membantu masyarakat Surabaya melaporkan kerusakan atau masalah fasilitas umum secara cepat, mudah, dan transparan.

SmartComplain memungkinkan pengguna membuat laporan, mengunggah foto, menentukan lokasi, serta memantau status laporan hingga selesai ditindaklanjuti.

Website dirancang dengan tampilan modern dan responsif agar tetap nyaman digunakan pada desktop maupun mobile device.

SmartComplain juga dilengkapi fitur AI classification yang membantu sistem menganalisis deskripsi laporan secara otomatis. AI akan menentukan kategori laporan, membuat ringkasan singkat, dan memberikan tingkat prioritas laporan berdasarkan isi pengaduan.

Selain fitur untuk pengguna, project ini juga menyediakan dashboard admin yang dapat digunakan untuk melihat laporan, memantau persebaran laporan melalui peta, serta melihat statistik laporan secara lebih terstruktur.

Project ini dikembangkan sebagai bagian dari tugas Studi Independen dan dikerjakan secara berkelompok.

* * *

## Fitur

* Responsive Design
* Modern UI Layout
* Landing Page
* Login & Register User
* Dashboard Pengguna
* Buat Laporan Pengaduan
* Upload Foto Laporan
* Deteksi Lokasi Pengguna
* Tracking Status Laporan
* Daftar Laporan Saya
* Notifikasi Status Laporan
* Profil Pengguna
* FAQ & Bantuan
* Dashboard Admin
* Manajemen Laporan Admin
* Peta Persebaran Laporan
* Statistik Laporan
* AI Klasifikasi Laporan menggunakan Llama 3.1 melalui OpenRouter
* Klasifikasi kategori laporan otomatis
* Ringkasan laporan otomatis
* Penentuan prioritas laporan otomatis
* Mobile Friendly
* Optimized Performance

* * *

## Tech Stack

* Next.js
* React
* Tailwind CSS
* TypeScript
* Supabase
* OpenRouter API
* Llama 3.1 8B Instruct
* Leaflet
* React Leaflet
* Recharts
* Vercel

* * *

## Libraries & Dependencies

| Library / Tools | Kegunaan |
|---|---|
| Next.js | Framework React untuk pengembangan web |
| React | Library frontend utama |
| React DOM | Rendering React ke browser |
| Tailwind CSS | Styling website |
| TypeScript | Static typing JavaScript |
| Supabase JS | Integrasi authentication dan database |
| Supabase SSR | Integrasi Supabase untuk server-side rendering |
| OpenRouter API | Menghubungkan aplikasi dengan model AI |
| Llama 3.1 8B Instruct | Model AI untuk klasifikasi laporan |
| Leaflet | Menampilkan peta interaktif |
| React Leaflet | Integrasi Leaflet dengan React |
| Recharts | Visualisasi data dan statistik laporan |
| Lucide React | Icon untuk tampilan UI |
| React Icons | Icon tambahan untuk komponen UI |
| ESLint | Membantu menjaga kualitas code |

* * *

## Struktur Folder

    SmartComplain/
    │
    ├── app/
    │   ├── (admin)/
    │   │   ├── admin/
    │   │   │   ├── beranda/
    │   │   │   ├── laporan/
    │   │   │   ├── maps/
    │   │   │   └── statistik/
    │   │   └── layout.tsx
    │   │
    │   ├── (auth)/
    │   │   ├── login/
    │   │   └── register/
    │   │
    │   ├── (dashboard)/
    │   │   ├── bantuan/
    │   │   ├── beranda/
    │   │   ├── buat/
    │   │   ├── faq/
    │   │   ├── laporan/
    │   │   ├── notifikasi/
    │   │   ├── pengaturan/
    │   │   ├── profil/
    │   │   ├── ClientDashboardLayout.tsx
    │   │   └── layout.tsx
    │   │
    │   ├── api/
    │   │   ├── ai/
    │   │   │   └── classify/
    │   │   │       └── route.ts
    │   │   └── laporan/
    │   │
    │   ├── admin.css
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── loading.tsx
    │   ├── not-found.tsx
    │   └── page.tsx
    │
    ├── component/
    │   ├── charts/
    │   ├── layout/
    │   └── ui/
    │
    ├── constants/
    ├── lib/
    │   ├── supabase/
    │   ├── openrouter.ts
    │   └── storage.ts
    │
    ├── public/
    ├── types/
    ├── utils/
    │
    ├── .gitignore
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── proxy.ts
    ├── tsconfig.json
    └── README.md

* * *

## AI Klasifikasi Laporan

SmartComplain menggunakan fitur AI untuk membantu proses klasifikasi laporan pengaduan fasilitas publik.

Fitur ini bekerja dengan mengirimkan deskripsi laporan ke OpenRouter API, kemudian model AI akan mengembalikan hasil analisis dalam format JSON.

Output AI meliputi:

* Kategori laporan
* Ringkasan laporan
* Prioritas laporan

Kategori laporan yang digunakan:

* Jalan & Trotoar
* Penerangan
* Sampah
* Drainase
* Taman & RTH
* Fasilitas Umum
* Lainnya

Prioritas laporan yang digunakan:

* Tinggi
* Sedang
* Rendah

Model AI yang digunakan:

    meta-llama/llama-3.1-8b-instruct:free

Endpoint API yang digunakan:

    /api/ai/classify

* * *

## Cara Menjalankan Project

### Clone Repository

    git clone https://github.com/Rev52/SmartComplain.git

### Masuk ke Folder Project

    cd SmartComplain

### Install Dependencies

    npm install

### Konfigurasi Environment Variable

Buat file `.env.local` di root project, lalu tambahkan konfigurasi berikut:

    OPENROUTER_API_KEY=your_openrouter_api_key
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Environment variable `OPENROUTER_API_KEY` digunakan untuk menjalankan fitur AI klasifikasi laporan menggunakan model Llama 3.1 melalui OpenRouter.

Environment variable Supabase digunakan untuk menghubungkan aplikasi dengan authentication, database, dan penyimpanan data laporan.

### Jalankan Development Server

    npm run dev

### Buka di Browser

    http://localhost:3000

* * *

## Available Scripts

### Development

    npm run dev

Menjalankan project dalam mode development.

### Build

    npm run build

Membuat versi production dari project.

### Start

    npm run start

Menjalankan project production setelah proses build.

### Lint

    npm run lint

Menjalankan ESLint untuk memeriksa kualitas code.

* * *

## Responsive Support

Website sudah dioptimalkan untuk:

* Desktop
* Tablet
* Mobile

* * *

## Tujuan Project

* Belajar pengembangan website modern menggunakan Next.js
* Melatih kemampuan frontend development
* Mengimplementasikan authentication dan database menggunakan Supabase
* Mengintegrasikan fitur AI menggunakan OpenRouter
* Membuat platform pengaduan fasilitas publik yang mudah digunakan
* Membantu warga dalam menyampaikan laporan secara digital
* Meningkatkan transparansi proses pengaduan
* Menyediakan dashboard admin untuk monitoring laporan
* Menjadi project portfolio untuk Studi Independen

* * *

## Catatan

Project ini masih dapat dikembangkan lebih lanjut dengan beberapa fitur tambahan seperti:

* Integrasi notifikasi real-time
* Role management yang lebih lengkap
* Filter laporan berdasarkan status dan kategori
* Export data laporan
* Integrasi peta dengan data wilayah Surabaya
* Deployment production menggunakan Vercel

* * *

## Author

SmartComplain Team
