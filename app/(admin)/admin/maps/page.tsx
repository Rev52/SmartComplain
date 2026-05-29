"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
import type { ComponentProps, ComponentType, ReactNode } from "react";
import type LaporanMapType from "@/component/maps/LaporanMap";

const LaporanMap = dynamic(() => import("@/component/maps/LaporanMap"), {
  ssr: false,
  loading: () => (
    <div className="loading-wrap">
      <div className="loading-stack">
        <div className="spinner" />
        <p className="loading-text">Memuat peta...</p>
      </div>
    </div>
  ),
}) as ComponentType<ComponentProps<typeof LaporanMapType>>;

interface LaporanRow {
  id: string;
  judul: string;
  kategori: string;
  status: string;
  prioritas: string;
  lokasi: string | null;
  kecamatan: string | null;
  lat: number | null;
  lng: number | null;
  latitude: number | null;
  longitude: number | null;
}

interface LaporanMarker {
  id: string;
  judul: string;
  kategori: string;
  status: string;
  prioritas: string;
  lokasi: string | null;
  kecamatan: string | null;
  lat: number;
  lng: number;
}

const PRIORITAS_LEGEND = [
  { label: "Tinggi", colorClass: "bg-red-500" },
  { label: "Sedang", colorClass: "bg-yellow-400" },
  { label: "Rendah", colorClass: "bg-green-500" },
];

interface MapStatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
}

function MapStatCard({ label, value, icon }: MapStatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-icon stat-icon--blue">{icon}</div>

      <div className="min-w-0">
        <p className="stat-label stat-label--blue">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

export default function AdminMapsPage() {
  const supabase = useRef(createClient()).current;

  const [laporan, setLaporan] = useState<LaporanMarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data, error } = await supabase
        .from("laporan")
        .select(
          "id, judul, kategori, status, prioritas, lokasi, kecamatan, lat, lng, latitude, longitude"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data maps:", error.message);
        setLaporan([]);
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as LaporanRow[];

      const normalized: LaporanMarker[] = rows
        .map((item) => {
          const markerLat = item.lat ?? item.latitude;
          const markerLng = item.lng ?? item.longitude;

          if (
            markerLat === null ||
            markerLng === null ||
            Number.isNaN(markerLat) ||
            Number.isNaN(markerLng)
          ) {
            return null;
          }

          return {
            id: item.id,
            judul: item.judul,
            kategori: item.kategori,
            status: item.status,
            prioritas: item.prioritas,
            lokasi: item.lokasi,
            kecamatan: item.kecamatan,
            lat: markerLat,
            lng: markerLng,
          };
        })
        .filter((item): item is LaporanMarker => item !== null);

      setLaporan(normalized);
      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  const topKecamatan = useMemo(() => {
    const count = laporan.reduce<Record<string, number>>((acc, item) => {
      if (item.kecamatan) {
        acc[item.kecamatan] = (acc[item.kecamatan] ?? 0) + 1;
      }

      return acc;
    }, {});

    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
  }, [laporan]);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Peta Sebaran Laporan</h1>
        <p className="page-subtitle">
          Visualisasi lokasi laporan yang masuk secara real-time.
        </p>
      </div>

      <div className="legend-bar">
        <p className="legend-title">Prioritas:</p>

        {PRIORITAS_LEGEND.map((item) => (
          <div key={item.label} className="legend-item">
            <div className={`legend-dot ${item.colorClass}`} />
            <span className="legend-text">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="card card-body">
        <LaporanMap laporan={laporan} loading={loading} />
      </div>

      <div className="map-stat-grid">
        <MapStatCard
          label="Total Marker"
          value={loading ? "..." : laporan.length}
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          }
        />

        <MapStatCard
          label="Top Kecamatan"
          value={loading ? "..." : topKecamatan}
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
          }
        />
      </div>
    </div>
  );
}