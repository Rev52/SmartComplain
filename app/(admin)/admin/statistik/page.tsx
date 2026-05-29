"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReactNode } from "react";

type Laporan = {
  kategori: string | null;
  status: string | null;
  prioritas: string | null;
  kecamatan: string | null;
};

type ChartItem = {
  name: string;
  value: number;
};

const KATEGORI_COLORS = [
  "#1d4ed8",
  "#16a34a",
  "#f97316",
  "#a855f7",
  "#0f766e",
  "#ef4444",
  "#64748b",
];

const STATUS_COLORS = {
  menunggu: "#f59e0b",
  diproses: "#3b82f6",
  ditindaklanjuti: "#a855f7",
  selesai: "#22c55e",
  ditolak: "#ef4444",
} as const;

const PRIORITAS_COLORS = {
  tinggi: "#ef4444",
  sedang: "#f59e0b",
  rendah: "#22c55e",
} as const;

const STATUS_ORDER = [
  "menunggu",
  "diproses",
  "ditindaklanjuti",
  "selesai",
  "ditolak",
];

const PRIORITAS_ORDER = ["tinggi", "sedang", "rendah"];

function formatLabel(value: string) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function countBy(items: Array<string | null | undefined>) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = item?.trim() || "Tidak diketahui";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex h-[240px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">
      {text}
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  variant: "blue" | "orange" | "green";
}

function SummaryCard({ label, value, icon, variant }: SummaryCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon--${variant}`}>{icon}</div>

      <div className="min-w-0">
        <p className={`stat-label stat-label--${variant}`}>{label}</p>
        <p
          className={`stat-value ${variant !== "blue" ? `stat-value--${variant}` : ""
            }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="card card-body min-w-0">
      <div className="mb-5">
        <h2 className="card-title">{title}</h2>
        {description && <p className="page-subtitle mt-1">{description}</p>}
      </div>

      {children}
    </section>
  );
}

function ProgressItem({
  name,
  value,
  max,
}: {
  name: string;
  value: number;
  max: number;
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-slate-700">{name}</p>
        <p className="shrink-0 text-sm font-bold text-blue-700">{value}</p>
      </div>

      <div className="progress-track">
        <div
          className="progress-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function StatistikPage() {
  const supabase = useRef(createClient()).current;
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data, error } = await supabase
        .from("laporan")
        .select("kategori, status, prioritas, kecamatan");

      if (error) {
        console.error("Gagal mengambil statistik:", error.message);
        setLaporan([]);
        setLoading(false);
        return;
      }

      setLaporan((data ?? []) as Laporan[]);
      setLoading(false);
    }

    fetchData();

    const channel = supabase
      .channel("laporan-statistik")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "laporan" },
        fetchData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const {
    totalLaporan,
    totalKategori,
    totalKecamatan,
    selesai,
    kategoriData,
    statusData,
    prioritasData,
    kecamatanData,
    maxKecamatan,
  } = useMemo(() => {
    const kategoriCount = countBy(laporan.map((item) => item.kategori));
    const statusCount = countBy(laporan.map((item) => item.status));
    const prioritasCount = countBy(laporan.map((item) => item.prioritas));
    const kecamatanCount = countBy(
      laporan
        .map((item) => item.kecamatan)
        .filter((item): item is string => Boolean(item))
    );

    const kategoriData: ChartItem[] = Object.entries(kategoriCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const statusData: ChartItem[] = STATUS_ORDER.map((name) => ({
      name: formatLabel(name),
      value: statusCount[name] ?? 0,
    }));

    const prioritasData: ChartItem[] = PRIORITAS_ORDER.map((name) => ({
      name: formatLabel(name),
      value: prioritasCount[name] ?? 0,
    }));

    const kecamatanData: ChartItem[] = Object.entries(kecamatanCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalLaporan: laporan.length,
      totalKategori: kategoriData.length,
      totalKecamatan: Object.keys(kecamatanCount).length,
      selesai: statusCount.selesai ?? 0,
      kategoriData,
      statusData,
      prioritasData,
      kecamatanData,
      maxKecamatan: kecamatanData[0]?.value ?? 1,
    };
  }, [laporan]);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Statistik Laporan</h1>
        <p className="page-subtitle">
          Ringkasan data laporan berdasarkan kategori, status, prioritas, dan
          kecamatan.
        </p>
      </div>

      <div className="stat-grid">
        <SummaryCard
          label="Total Laporan"
          value={loading ? "..." : totalLaporan}
          variant="blue"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
        />

        <SummaryCard
          label="Kategori"
          value={loading ? "..." : totalKategori}
          variant="orange"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10V7a2 2 0 0 0-2-2h-3" />
              <path d="M4 14v3a2 2 0 0 0 2 2h3" />
              <rect x="4" y="5" width="7" height="7" rx="1" />
              <rect x="13" y="12" width="7" height="7" rx="1" />
            </svg>
          }
        />

        <SummaryCard
          label="Selesai"
          value={loading ? "..." : selesai}
          variant="green"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
        />
      </div>

      <div className="admin-dashboard-grid">
        <ChartCard
          title="Laporan per Kategori"
          description="Distribusi laporan berdasarkan jenis masalah."
        >
          {loading || kategoriData.length === 0 ? (
            <EmptyState text={loading ? "Memuat data..." : "Belum ada data."} />
          ) : (
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kategoriData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    label
                  >
                    {kategoriData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={KATEGORI_COLORS[index % KATEGORI_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Status Laporan"
          description="Perbandingan jumlah laporan berdasarkan status."
        >
          {loading || statusData.every((item) => item.value === 0) ? (
            <EmptyState text={loading ? "Memuat data..." : "Belum ada data."} />
          ) : (
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {STATUS_ORDER.map((status) => (
                      <Cell
                        key={status}
                        fill={
                          STATUS_COLORS[status as keyof typeof STATUS_COLORS]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Top Kecamatan"
          description="Kecamatan dengan jumlah laporan terbanyak."
        >
          {loading || kecamatanData.length === 0 ? (
            <EmptyState text={loading ? "Memuat data..." : "Belum ada data."} />
          ) : (
            <div className="space-y-5">
              {kecamatanData.map((item) => (
                <ProgressItem
                  key={item.name}
                  name={item.name}
                  value={item.value}
                  max={maxKecamatan}
                />
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Prioritas Laporan"
          description="Jumlah laporan berdasarkan tingkat prioritas."
        >
          {loading || prioritasData.every((item) => item.value === 0) ? (
            <EmptyState text={loading ? "Memuat data..." : "Belum ada data."} />
          ) : (
            <div className="space-y-4">
              {prioritasData.map((item) => {
                const key = item.name.toLowerCase() as keyof typeof PRIORITAS_COLORS;
                const total = Math.max(totalLaporan, 1);
                const percentage = (item.value / total) * 100;

                return (
                  <div
                    key={item.name}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: PRIORITAS_COLORS[key] }}
                        />
                        <p className="text-sm font-semibold text-slate-700">
                          {item.name}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-slate-900">
                        {item.value}
                      </p>
                    </div>

                    <div className="progress-track">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: PRIORITAS_COLORS[key],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>
      </div>

      <div className="card card-body">
        <h2 className="card-title mb-2">Ringkasan</h2>
        <p className="text-sm leading-6 text-slate-600">
          Saat ini terdapat{" "}
          <span className="font-semibold text-blue-700">{totalLaporan}</span>{" "}
          laporan dari{" "}
          <span className="font-semibold text-blue-700">{totalKecamatan}</span>{" "}
          kecamatan. Data statistik akan diperbarui otomatis ketika ada laporan
          baru atau perubahan status laporan.
        </p>
      </div>
    </div>
  );
}