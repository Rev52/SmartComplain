// components/laporan/StatusBadge.tsx

// ── Tipe ───────────────────────────────────────────────────
type Status =
  | "menunggu"
  | "diproses"
  | "selesai"
  | "ditolak"
  | "ditindaklanjuti";
type Prioritas = "tinggi" | "sedang" | "rendah";

// ── Konfigurasi ─────────────────────────────────────────────
// Label tampilan untuk setiap status & prioritas
const STATUS_LABEL: Record<Status, string> = {
  menunggu: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
  ditindaklanjuti: "Ditindaklanjuti",
};

const PRIORITAS_LABEL: Record<Prioritas, string> = {
  tinggi: "Tinggi",
  sedang: "Sedang",
  rendah: "Rendah",
};

// ── Komponen ────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABEL[status as Status] ?? status;
  const modifier = `badge--${status}`; // mis. badge--selesai

  return <span className={`badge ${modifier}`}>{label}</span>;
}

export function PriorityBadge({ prioritas }: { prioritas: string }) {
  const label = PRIORITAS_LABEL[prioritas as Prioritas] ?? prioritas;
  const modifier = `badge--${prioritas}`; // mis. badge--tinggi

  return <span className={`badge ${modifier}`}>{label}</span>;
}
