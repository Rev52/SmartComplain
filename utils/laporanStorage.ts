import { getCurrentUser } from "./authStorage";

export interface Laporan {
  routeId: string;
  id: string; // SP-230-001
  title: string;
  address: string;
  date: string;
  time: string;
  status: string; // "Dalam Proses" | "Selesai" | "Ditolak"
  category: string;
  priority: string;
  author: string;
  contact: string;
  handledBy: string;
  description: string;
  images?: string[]; // Array of base64 image strings
}

const DEFAULT_LAPORAN: Laporan[] = [
  {
    routeId: "1",
    id: "SP-230-001",
    title: "Jalan Berlubang di Jl.Jagir Wonokromo",
    address: "Jl. Jagir No.20, Wonokromo, Surabaya",
    date: "23 Mei 2026",
    time: "14.30 WIB",
    status: "Dalam Proses",
    category: "Jalan & Infrastruktur",
    priority: "Sedang",
    author: "Dwi Susanto",
    contact: "0831-3458-9077",
    handledBy: "Dinas Perhubungan",
    description: "Banyaknya jalan tambalan cukup mengganggu perjalanannya. Menurut Agus, sepanjang Jalan Jagir hingga Panjang Jiwo banyak tambalan aspal."
  },
  {
    routeId: "2",
    id: "SP-230-002",
    title: "Banjir di Jl. Trenggilis Mulya",
    address: "Jl. Trenggilis Mulya No.40, Surabaya",
    date: "20 Mei 2026",
    time: "09.15 WIB",
    status: "Selesai",
    category: "Saluran Air",
    priority: "Tinggi",
    author: "Budi Santoso",
    contact: "0812-9876-5432",
    handledBy: "Dinas Pekerjaan Umum",
    description: "Saluran air tersumbat sampah menyebabkan genangan air setinggi lutut orang dewasa setiap kali hujan deras turun lebih dari 1 jam."
  },
  {
    routeId: "3",
    id: "SP-230-003",
    title: "Proyek Tertunda di kawasan Sukomanunggal",
    address: "Sukomanunggal, Surabaya",
    date: "18 Mei 2026",
    time: "10.00 WIB",
    status: "Dalam Proses",
    category: "Jalan & Infrastruktur",
    priority: "Rendah",
    author: "Citra Kirana",
    contact: "0857-1122-3344",
    handledBy: "Dinas Cipta Karya",
    description: "Galian pipa PDAM dibiarkan menganga selama 2 minggu tanpa ada pekerja yang melanjutkan proyek. Debu sangat mengganggu warga sekitar."
  },
  {
    routeId: "4",
    id: "SP-230-004",
    title: "Tumpukan Sampah Rumah Tangga di Jemur Gayungan",
    address: "Jemur Gayungan, Surabaya",
    date: "15 Mei 2026",
    time: "07.45 WIB",
    status: "Ditolak",
    category: "Kebersihan",
    priority: "Sedang",
    author: "Andi Saputra",
    contact: "0896-5544-3322",
    handledBy: "Dinas Lingkungan Hidup",
    description: "Truk sampah belum mengambil sampah rumah tangga selama 4 hari. Bau menyengat mulai mengganggu aktivitas warga setempat."
  }
];

export const getLaporan = (): Laporan[] => {
  if (typeof window === "undefined") return []; // SSR fallback
  
  const saved = localStorage.getItem("smartcomplain_laporan");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing laporan", e);
    }
  }
  
  // Initialize with default
  localStorage.setItem("smartcomplain_laporan", JSON.stringify(DEFAULT_LAPORAN));
  return DEFAULT_LAPORAN;
};

export const addLaporan = (newLaporanData: Partial<Laporan>) => {
  const list = getLaporan();
  
  const newRouteId = (list.length > 0 ? Math.max(...list.map(l => parseInt(l.routeId) || 0)) + 1 : 1).toString();
  const dateObj = new Date();
  
  // Format tanggal ex: 28 Mei 2026
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const formattedDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  const formattedTime = `${dateObj.getHours().toString().padStart(2, '0')}.${dateObj.getMinutes().toString().padStart(2, '0')} WIB`;

  const newLaporan: Laporan = {
    routeId: newRouteId,
    id: `SP-230-${newRouteId.padStart(3, '0')}`,
    title: newLaporanData.title || "Laporan Tanpa Judul",
    address: newLaporanData.address || "Lokasi tidak diketahui",
    date: formattedDate,
    time: formattedTime,
    status: "Dalam Proses",
    category: newLaporanData.category || "Lainnya",
    priority: "Sedang",
    author: getCurrentUser()?.nama || "Pengguna",
    contact: getCurrentUser()?.telepon || "08xx-xxxx-xxxx",
    handledBy: "Menunggu Verifikasi",
    description: newLaporanData.description || "",
    images: newLaporanData.images || [],
  };

  list.unshift(newLaporan); // Add to top
  localStorage.setItem("smartcomplain_laporan", JSON.stringify(list));
  
  return newLaporan;
};

export const getLaporanById = (routeId: string): Laporan | undefined => {
  const list = getLaporan();
  return list.find(l => l.routeId === routeId);
};
