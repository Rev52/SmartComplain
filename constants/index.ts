export const KATEGORI = [
    'Jalan & Trotoar',
    'Penerangan',
    'Sampah',
    'Drainase',
    'Taman & RTH',
    'Fasilitas Umum',
    'Lainnya',
] as const

export const STATUS_LAPORAN = {
    menunggu: 'Menunggu',
    diproses: 'Diproses',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
    ditindaklanjuti: 'Ditindaklanjuti',
} as const

export const PRIORITAS = {
    rendah: 'Rendah',
    sedang: 'Sedang',
    tinggi: 'Tinggi',
} as const

export type KategoriType = typeof KATEGORI[number]
export type StatusType = keyof typeof STATUS_LAPORAN
export type PrioritasType = keyof typeof PRIORITAS