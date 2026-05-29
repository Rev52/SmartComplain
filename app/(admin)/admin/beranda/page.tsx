// app/(admin)/admin/beranda/page.tsx
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { StatusBadge } from "@/component/laporan/StatusBadge"

// ── Tipe & konstanta ────────────────────────────────────────
type LaporanStatus =
    | "menunggu"
    | "diproses"
    | "selesai"
    | "ditolak"
    | "ditindaklanjuti";

type Laporan = {
    id: string;
    judul: string | null;
    kategori: string | null;
    kecamatan: string | null;
    status: LaporanStatus | null;
    prioritas: "tinggi" | "sedang" | "rendah" | null;
    created_at: string | null;
};

const DONUT_RADIUS = 15.9
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS // ~99.9

const STATUS_COLORS: Record<LaporanStatus, string> = {
    menunggu: "#f59e0b",
    diproses: "#3b82f6",
    selesai: "#22c55e",
    ditindaklanjuti: "#a855f7",
    ditolak: "#ef4444",
}

const PRIORITY_COLOR = {
    tinggi: "bg-red-500",
    sedang: "bg-yellow-500",
    rendah: "bg-green-500",
} as const

// ── Helper: hitung segmen donut ─────────────────────────────
function buildDonutSegments(
    data: { value: number; color: string }[],
    total: number
) {
    if (total === 0) return []
    let offset = 0
    return data.map(({ value, color }) => {
        const dash = (value / total) * DONUT_CIRCUMFERENCE
        const gap = DONUT_CIRCUMFERENCE - dash
        const segment = { color, dash, gap, offset }
        offset += dash
        return segment
    })
}

// ── Sub-komponen: Stat Card ──────────────────────────────────
interface StatCardProps {
    label: string
    value: number
    variant: "blue" | "orange" | "green"
    icon: React.ReactNode
}

function StatCard({ label, value, variant, icon }: StatCardProps) {
    return (
        <div className="stat-card">
            <div className={`stat-icon stat-icon--${variant}`}>
                {icon}
            </div>
            <div>
                <p className={`stat-label stat-label--${variant}`}>{label}</p>
                <p className={`stat-value ${variant !== "blue" ? `stat-value--${variant}` : ""}`}>
                    {value}
                </p>
            </div>
        </div>
    )
}

// ── Sub-komponen: Donut Chart ────────────────────────────────
interface DonutLegendItem {
    label: string
    value: number
    colorClass: string
}

interface DonutChartProps {
    total: number
    segments: ReturnType<typeof buildDonutSegments>
    legend: DonutLegendItem[]
}

function DonutChart({ total, segments, legend }: DonutChartProps) {
    return (
        <>
            <div className="donut-wrap">
                <div className="donut-inner">
                    <svg viewBox="0 0 36 36" className="w-40 h-40 -rotate-90">
                        <circle cx="18" cy="18" r={DONUT_RADIUS} fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
                        {total > 0 && segments.map((seg, i) =>
                            seg.dash > 0 && (
                                <circle
                                    key={i}
                                    cx="18" cy="18" r={DONUT_RADIUS}
                                    fill="none"
                                    stroke={seg.color}
                                    strokeWidth="3.5"
                                    strokeDasharray={`${seg.dash} ${seg.gap}`}
                                    strokeDashoffset={-seg.offset}
                                />
                            )
                        )}
                    </svg>
                    <div className="donut-center">
                        <span className="donut-total">{total}</span>
                        <span className="donut-label">Total</span>
                    </div>
                </div>
            </div>

            <div className="donut-legend">
                {legend.filter(item => item.value > 0).map(item => (
                    <div key={item.label} className="donut-legend-item">
                        <div className="donut-legend-left">
                            <div className={`donut-legend-dot ${item.colorClass}`} />
                            <span className="text-gray-600">{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{item.value}</span>
                    </div>
                ))}
            </div>
        </>
    )
}

// ── Halaman utama ────────────────────────────────────────────
export default async function AdminBerandaPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from("profiles").select("full_name").eq("id", user!.id).single()

    const { data } = await supabase
        .from("laporan")
        .select("*")
        .order("created_at", { ascending: false });

    const laporan = (data ?? []) as Laporan[];

    // Hitung statistik
    const total = laporan?.length ?? 0
    const diproses = laporan?.filter(l => l.status === "diproses").length ?? 0
    const selesai = laporan?.filter(l => l.status === "selesai").length ?? 0
    const menunggu = laporan?.filter(l => l.status === "menunggu").length ?? 0
    const ditindaklanjuti = laporan?.filter(l => l.status === "ditindaklanjuti").length ?? 0
    const ditolak = laporan?.filter(l => l.status === "ditolak").length ?? 0
    const prioritasTinggi = laporan?.filter(l => l.prioritas === "tinggi").length ?? 0
    const prioritasSedang = laporan?.filter(l => l.prioritas === "sedang").length ?? 0
    const prioritasRendah = laporan?.filter(l => l.prioritas === "rendah").length ?? 0
    const laporanTerbaru = laporan?.slice(0, 5) ?? []

    const donutSegments = buildDonutSegments([
        { value: menunggu, color: STATUS_COLORS.menunggu },
        { value: diproses, color: STATUS_COLORS.diproses },
        { value: selesai, color: STATUS_COLORS.selesai },
        { value: ditindaklanjuti, color: STATUS_COLORS.ditindaklanjuti },
        { value: ditolak, color: STATUS_COLORS.ditolak },
    ], total)

    const donutLegend = [
        { label: "Menunggu", value: menunggu, colorClass: "bg-yellow-400" },
        { label: "Diproses", value: diproses, colorClass: "bg-blue-500" },
        { label: "Ditindaklanjuti", value: ditindaklanjuti, colorClass: "bg-purple-500" },
        { label: "Selesai", value: selesai, colorClass: "bg-green-500" },
        { label: "Ditolak", value: ditolak, colorClass: "bg-red-500" },
    ]

    return (
        <div className="admin-shell">
            <div className="admin-page">
                {/* Header */}
                <div className="page-header">
                    <h1 className="page-title">Halo, Admin!</h1>
                    <p className="page-subtitle">Berikut ringkasan laporan pengaduan hari ini.</p>
                </div>

                {/* Stat Cards */}
                <div className="stat-grid">
                    <StatCard
                        label="Total Laporan" value={total} variant="blue"
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Proses" value={diproses} variant="orange"
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Selesai" value={selesai} variant="green"
                        icon={
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        }
                    />
                </div>

                {/* Konten Utama */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Kolom kiri: Laporan Terbaru + Prioritas */}
                    <div className="col-span-2 space-y-6">
                        {/* Laporan Terbaru */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Laporan Terbaru</h2>
                            </div>
                            <div className="px-6">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Nama Laporan</th>
                                            <th className="text-right">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {laporanTerbaru.map((item, i) => (
                                            <tr key={item.id}>
                                                <td className="text-gray-700">
                                                    {i + 1}. {item.judul}
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {item.kategori} · {item.kecamatan}
                                                    </p>
                                                </td>
                                                <td className="text-right">
                                                    <StatusBadge status={item.status ?? "menunggu"} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer">
                                <Link href="/admin/laporan" className="text-blue-600 text-sm hover:underline">
                                    Lihat semua laporan →
                                </Link>
                            </div>
                        </div>

                        {/* Prioritas */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Prioritas</h2>
                            </div>
                            <div className="px-6 pb-5">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Jenis Prioritas</th>
                                            <th className="text-right">Jumlah Laporan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { label: "1. Prioritas Tinggi", value: prioritasTinggi, color: "text-red-500" },
                                            { label: "2. Prioritas Sedang", value: prioritasSedang, color: "text-yellow-500" },
                                            { label: "3. Prioritas Rendah", value: prioritasRendah, color: "text-green-500" },
                                        ].map(p => (
                                            <tr key={p.label}>
                                                <td className="text-gray-700">{p.label}</td>
                                                <td className={`text-right font-bold ${p.color}`}>{p.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Kolom kanan: Donut Chart Status */}
                    <div className="card card-body h-fit">
                        <h2 className="font-bold text-gray-800 text-base mb-4">Status Laporan</h2>
                        <DonutChart
                            total={total}
                            segments={donutSegments}
                            legend={donutLegend}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}