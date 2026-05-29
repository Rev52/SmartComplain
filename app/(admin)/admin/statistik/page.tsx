// app/(admin)/admin/statistik/page.tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts"

// ── Tipe ──────────────────────────────────────────────────
type Laporan = {
    kategori: string
    status: string
    prioritas: string
    kecamatan: string | null
}

type ChartItem = { name: string; value: number }

// ── Warna chart ───────────────────────────────────────────
const KATEGORI_COLORS = ["#1d4ed8", "#166534", "#92400e", "#7e22ce", "#065f46"]
const STATUS_COLORS = ["#eab308", "#2563eb", "#16a34a", "#6b7280", "#dc2626"]

// Status dalam urutan tetap
const STATUS_URUTAN = ["menunggu", "diproses", "selesai", "ditolak", "ditindaklanjuti"]

// ── Helper: hitung frekuensi dari array of strings ─────────
function hitungFrekuensi(items: string[]): Record<string, number> {
    return items.reduce<Record<string, number>>((acc, item) => {
        acc[item] = (acc[item] ?? 0) + 1
        return acc
    }, {})
}

// ── Sub-komponen: Chart Card ──────────────────────────────
interface ChartCardProps {
    title: string
    children: React.ReactNode
}

function ChartCard({ title, children }: ChartCardProps) {
    return (
        <div className="card card-body">
            <h2 className="card-title mb-5">{title}</h2>
            {children}
        </div>
    )
}

// ── Sub-komponen: Progress Bar Kecamatan ─────────────────
interface ProgressItemProps {
    name: string
    value: number
    max: number
}

function ProgressItem({ name, value, max }: ProgressItemProps) {
    const pct = max > 0 ? (value / max) * 100 : 0
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span className="font-medium text-gray-700 text-sm">{name}</span>
                <span className="font-semibold text-gray-800 text-sm">{value}</span>
            </div>
            <div className="progress-track">
                <div className="progress-bar" style={{ width: `${pct}%` }} />
            </div>
        </div>
    )
}

// ── Halaman utama ─────────────────────────────────────────
export default function StatistikPage() {
    const supabase = createClient()
    const [laporan, setLaporan] = useState<Laporan[]>([])

    async function fetchData() {
        const { data } = await supabase
            .from("laporan")
            .select("kategori, status, prioritas, kecamatan")
        if (data) setLaporan(data)
    }

    useEffect(() => {
        fetchData()

        const channel = supabase
            .channel("laporan-statistik")
            .on("postgres_changes", { event: "*", schema: "public", table: "laporan" }, fetchData)
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [])

    // ── Olah data ────────────────────────────────────────
    const kategoriCount = hitungFrekuensi(laporan.map(l => l.kategori))
    const statusCount = hitungFrekuensi(laporan.map(l => l.status))
    const kecamatanCount = hitungFrekuensi(
        laporan.filter(l => l.kecamatan).map(l => l.kecamatan as string)
    )

    const kategoriData: ChartItem[] = Object.entries(kategoriCount).map(([name, value]) => ({ name, value }))

    const statusData: ChartItem[] = STATUS_URUTAN.map(name => ({
        name,
        value: statusCount[name] ?? 0,
    }))

    const kecamatanData: ChartItem[] = Object.entries(kecamatanCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

    const maxKecamatan = kecamatanData[0]?.value ?? 1

    return (
        <div className="admin-shell">
            <div className="admin-page">
                {/* Header */}
                <div className="page-header">
                    <h1 className="page-title">Statistik Laporan</h1>
                    <p className="page-subtitle">Ringkasan data laporan berdasarkan kategori dan kecamatan.</p>
                </div>

                {/* Chart: Kategori */}
                <ChartCard title="Laporan per Kategori">
                    <div style={{ height: "240px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={kategoriData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                    {kategoriData.map((_, i) => (
                                        <Cell key={i} fill={KATEGORI_COLORS[i % KATEGORI_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Chart: Status */}
                <ChartCard title="Status Laporan">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div style={{ height: "240px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={90}
                                        paddingAngle={2}
                                    >
                                        {statusData.map((_, i) => (
                                            <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legenda status */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {statusData.map((item, i) => (
                                <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.875rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <div
                                            style={{
                                                width: "0.75rem", height: "0.75rem", borderRadius: "50%",
                                                background: STATUS_COLORS[i % STATUS_COLORS.length],
                                            }}
                                        />
                                        <span className="font-medium text-gray-700 capitalize">{item.name}</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </ChartCard>

                {/* Progress: Kecamatan */}
                <ChartCard title="Kecamatan Terbanyak">
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {kecamatanData.map(item => (
                            <ProgressItem
                                key={item.name}
                                name={item.name}
                                value={item.value}
                                max={maxKecamatan}
                            />
                        ))}
                    </div>
                </ChartCard>
            </div>
        </div>
    )
}