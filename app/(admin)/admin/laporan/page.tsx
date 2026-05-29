"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge, PriorityBadge } from "@/component/laporan/StatusBadge";

type ProfileRel = {
    full_name: string | null;
    email: string | null;
    phone: string | null;
};

interface Laporan {
    id: string;
    judul: string;
    kategori: string;
    status: string;
    prioritas: string;
    lokasi: string;
    deskripsi: string;
    kecamatan: string;
    created_at: string;
    user_id: string;
    foto_url?: string[] | null;
    profiles?: ProfileRel[] | ProfileRel | null;
}

const PER_PAGE = 5;

const HEADER_COLS = [
    "No",
    "ID Laporan",
    "Nama Laporan",
    "Kategori",
    "Tanggal",
    "Status",
    "Prioritas",
    "Aksi",
];

const STATUS_OPTIONS = [
    { value: "menunggu", label: "Menunggu" },
    { value: "diproses", label: "Diproses" },
    { value: "ditindaklanjuti", label: "Ditindaklanjuti" },
    { value: "selesai", label: "Selesai" },
    { value: "ditolak", label: "Ditolak" },
];

const supabase = createClient();
const CURRENT_YEAR = new Date().getFullYear();

function formatTanggal(iso: string): string {
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function getLaporanId(index: number, page: number): string {
    const globalIndex = (page - 1) * PER_PAGE + index;
    return `LPR-${CURRENT_YEAR}-${String(globalIndex + 1).padStart(3, "0")}`;
}

function getProfile(profileData: Laporan["profiles"]): ProfileRel | null {
    if (!profileData) return null;

    if (Array.isArray(profileData)) {
        return profileData[0] ?? null;
    }

    return profileData;
}

function DetailLaporan({ item }: { item: Laporan }) {
    const profile = getProfile(item.profiles);

    const fields = [
        { label: "Lokasi", value: item.lokasi ?? "-" },
        { label: "Status", value: item.status ?? "-" },
        { label: "Deskripsi", value: item.deskripsi ?? "-" },
        { label: "Tanggal Lapor", value: formatTanggal(item.created_at) },
        { label: "Prioritas", value: item.prioritas ?? "-" },
        { label: "Pelapor", value: profile?.full_name ?? "-" },
        { label: "Kontak", value: profile?.phone ?? "-" },
        { label: "Kategori", value: item.kategori ?? "-" },
    ];

    return (
        <div className="card-blue-border card-body">
            <h2 className="card-title mb-5">Detail Laporan</h2>

            <div style={{ display: "flex", gap: "1.5rem" }}>
                <div className="detail-photo">
                    {item.foto_url?.[0] ? (
                        <img src={item.foto_url[0]} alt="Foto laporan" />
                    ) : (
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#d1d5db"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    )}
                </div>

                <div className="detail-grid">
                    {fields.map((field) => (
                        <div key={field.label}>
                            <p className="detail-label">{field.label}</p>
                            <p className="detail-value capitalize">{field.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface PaginationProps {
    page: number;
    totalPages: number;
    totalItems: number;
    onChangePage: (p: number) => void;
    loading: boolean;
}

function Pagination({
    page,
    totalPages,
    totalItems,
    onChangePage,
    loading,
}: PaginationProps) {
    const from =
        totalItems === 0 ? 0 : Math.min((page - 1) * PER_PAGE + 1, totalItems);

    const to = Math.min(page * PER_PAGE, totalItems);

    return (
        <div className="pagination-wrap">
            <div className="pagination-btns">
                <button
                    className="page-btn"
                    disabled={page === 1 || loading}
                    onClick={() => onChangePage(page - 1)}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => onChangePage(p)}
                        disabled={loading}
                        className={`page-btn ${page === p ? "is-active" : ""}`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    className="page-btn"
                    disabled={page === totalPages || loading}
                    onClick={() => onChangePage(page + 1)}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>

            <p className="pagination-info">
                Menampilkan {from}–{to} dari {totalItems} laporan
            </p>
        </div>
    );
}

interface LaporanRowProps {
    item: Laporan;
    index: number;
    page: number;
    isSelected: boolean;
    onSelect: (item: Laporan) => void;
    onStatusChange: (id: string, status: string) => void;
}

const LaporanRow = memo(
    function LaporanRow({
        item,
        index,
        page,
        isSelected,
        onSelect,
        onStatusChange,
    }: LaporanRowProps) {
        return (
            <tr
                onClick={() => onSelect(item)}
                className={isSelected ? "is-selected" : ""}
            >
                <td className="text-gray-500">
                    {(page - 1) * PER_PAGE + index + 1}
                </td>

                <td className="text-gray-600 font-mono text-xs">
                    {getLaporanId(index, page)}
                </td>

                <td className="text-gray-800 font-medium">{item.judul}</td>

                <td className="text-gray-600">{item.kategori}</td>

                <td className="text-gray-600">{formatTanggal(item.created_at)}</td>

                <td>
                    <StatusBadge status={item.status} />
                </td>

                <td>
                    <PriorityBadge prioritas={item.prioritas} />
                </td>

                <td>
                    <select
                        value={item.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onStatusChange(item.id, e.target.value)}
                        className="status-select"
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </td>
            </tr>
        );
    },
    (prev, next) =>
        prev.item.id === next.item.id &&
        prev.item.status === next.item.status &&
        prev.isSelected === next.isSelected &&
        prev.page === next.page
);

export default function AdminLaporanPage() {
    const [laporan, setLaporan] = useState<Laporan[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Laporan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        async function fetchLaporan() {
            setLoading(true);

            const from = (page - 1) * PER_PAGE;
            const to = from + PER_PAGE - 1;

            let query = supabase
                .from("laporan")
                .select(
                    `
          id,
          judul,
          kategori,
          status,
          prioritas,
          lokasi,
          deskripsi,
          kecamatan,
          created_at,
          user_id,
          foto_url,
          profiles (
            full_name,
            email,
            phone
          )
        `,
                    { count: "exact" }
                )
                .order("created_at", { ascending: false })
                .range(from, to);

            if (debouncedSearch) {
                query = query.or(
                    `judul.ilike.%${debouncedSearch}%,kategori.ilike.%${debouncedSearch}%,kecamatan.ilike.%${debouncedSearch}%`
                );
            }

            const { data, count, error } = await query;

            if (error) {
                console.error("Gagal mengambil laporan:", error.message);
                setLaporan([]);
                setTotalItems(0);
                setSelected(null);
                setLoading(false);
                return;
            }

            const rows = (data ?? []) as Laporan[];

            setLaporan(rows);
            setTotalItems(count ?? 0);
            setSelected(rows.length > 0 ? rows[0] : null);
            setLoading(false);
        }

        fetchLaporan();
    }, [page, debouncedSearch]);

    const updateStatus = useCallback(async (id: string, status: string) => {
        const { error } = await supabase
            .from("laporan")
            .update({ status })
            .eq("id", id);

        if (error) {
            console.error("Gagal update status:", error.message);
            return;
        }

        setLaporan((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status } : item))
        );

        setSelected((prev) =>
            prev?.id === id ? { ...prev, status } : prev
        );
    }, []);

    const handleSelect = useCallback((item: Laporan) => {
        setSelected(item);
    }, []);

    const totalPages = Math.max(1, Math.ceil(totalItems / PER_PAGE));

    return (
        <div className="admin-shell">
            <div className="admin-page">
                <div className="card-blue-border">
                    <div className="card-header">
                        <div>
                            <h1 className="card-title">Daftar Laporan</h1>
                            <p className="page-subtitle">
                                Kelola dan pantau semua laporan yang masuk.
                            </p>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                            }}
                        >
                            <div className="search-wrap">
                                <svg
                                    className="search-icon"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>

                                <input
                                    type="text"
                                    placeholder="Cari laporan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            <button className="btn--icon">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="px-6">
                        <table className="report-table w-full text-sm">
                            <thead>
                                <tr>
                                    {HEADER_COLS.map((header) => (
                                        <th key={header}>{header}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    Array.from({ length: PER_PAGE }).map((_, i) => (
                                        <tr key={i}>
                                            {Array.from({ length: HEADER_COLS.length }).map(
                                                (_, j) => (
                                                    <td key={j}>
                                                        <div
                                                            style={{
                                                                height: "12px",
                                                                background: "#e5e7eb",
                                                                borderRadius: "4px",
                                                                width: j === 2 ? "80%" : "60%",
                                                            }}
                                                        />
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    ))
                                ) : laporan.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={HEADER_COLS.length}
                                            className="text-center py-10 text-gray-400 text-sm"
                                        >
                                            Tidak ada laporan ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    laporan.map((item, i) => (
                                        <LaporanRow
                                            key={item.id}
                                            item={item}
                                            index={i}
                                            page={page}
                                            isSelected={selected?.id === item.id}
                                            onSelect={handleSelect}
                                            onStatusChange={updateStatus}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        onChangePage={setPage}
                        loading={loading}
                    />
                </div>

                {selected && <DetailLaporan item={selected} />}
            </div>
        </div>
    );
}