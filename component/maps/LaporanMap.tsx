// components/maps/LaporanMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Tipe ──────────────────────────────────────────────────
interface LaporanItem {
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

interface LaporanMapProps {
  laporan: LaporanItem[];
  loading?: boolean;
}

// ── Konstanta ─────────────────────────────────────────────
const MAP_CENTER: [number, number] = [-7.2575, 112.7521];

const PRIORITAS_COLOR: Record<string, string> = {
  tinggi: "#ef4444",
  sedang: "#f59e0b",
  rendah: "#22c55e",
};

const PRIORITAS_LABEL: Record<string, string> = {
  tinggi: "Tinggi",
  sedang: "Sedang",
  rendah: "Rendah",
};

const PRIORITAS_BADGE: Record<string, { bg: string; color: string }> = {
  tinggi: { bg: "#fee2e2", color: "#dc2626" },
  sedang: { bg: "#fef3c7", color: "#d97706" },
  rendah: { bg: "#dcfce7", color: "#16a34a" },
};

const STATUS_LABEL: Record<string, string> = {
  menunggu: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
  ditindaklanjuti: "Ditindaklanjuti",
};

// ── Helper: buat ikon marker ───────────────────────────────
function createMarkerIcon(prioritas: string): L.DivIcon {
  const color = PRIORITAS_COLOR[prioritas] ?? "#6b7280";
  return L.divIcon({
    className: "",
    html: `
            <div style="
                width: 28px; height: 28px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex; align-items: center; justify-content: center;
            ">
                <div style="width:8px;height:8px;background:white;border-radius:50%;"></div>
            </div>
        `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

const MARKER_ICONS: Record<string, L.DivIcon> = {
  tinggi: createMarkerIcon("tinggi"),
  sedang: createMarkerIcon("sedang"),
  rendah: createMarkerIcon("rendah"),
  default: createMarkerIcon("default"),
};

// ── Sub-komponen: Popup konten marker ─────────────────────
function MarkerPopup({ item }: { item: LaporanItem }) {
  const badge = PRIORITAS_BADGE[item.prioritas];
  const p_label = PRIORITAS_LABEL[item.prioritas] ?? item.prioritas;
  const s_label = STATUS_LABEL[item.status] ?? item.status;

  const baseText: React.CSSProperties = { fontSize: "12px", color: "#6b7280" };
  const pillBase: React.CSSProperties = {
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "999px",
    fontWeight: 500,
  };

  return (
    <div style={{ minWidth: "180px" }}>
      <p style={{ fontWeight: 600, marginBottom: "4px", fontSize: "13px" }}>
        {item.judul}
      </p>
      <p style={{ ...baseText }}>
        {item.kategori} · {item.kecamatan ?? "-"}
      </p>
      <p style={{ ...baseText, marginBottom: "8px" }}>{item.lokasi ?? "-"}</p>
      <div style={{ display: "flex", gap: "6px" }}>
        <span
          style={{
            ...pillBase,
            background: badge?.bg ?? "#f3f4f6",
            color: badge?.color ?? "#374151",
          }}
        >
          {p_label}
        </span>
        <span style={{ ...pillBase, background: "#eff6ff", color: "#2563eb" }}>
          {s_label}
        </span>
      </div>
    </div>
  );
}

// ── Komponen utama ─────────────────────────────────────────
export default function LaporanMap({ laporan, loading }: LaporanMapProps) {
  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={MAP_CENTER}
        zoom={12}
        style={{ height: "420px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {laporan.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={MARKER_ICONS[item.prioritas] ?? MARKER_ICONS.default}
          >
            <Popup>
              <MarkerPopup item={item} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            zIndex: 1000,
          }}
        >
          <div className="spinner" />
        </div>
      )}
    </div>
  );
}
