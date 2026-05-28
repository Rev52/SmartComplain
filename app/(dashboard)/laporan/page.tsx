"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Plus 
} from "lucide-react";
import { getLaporan, Laporan } from "@/utils/laporanStorage";
import { useLanguage } from "@/utils/languageStorage";

type StatusLaporan = "Dalam Proses" | "Selesai" | "Ditolak";

export default function LaporanSayaPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("Semua");
  const [daftarLaporan, setDaftarLaporan] = useState<Laporan[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const ITEMS_PER_PAGE = 5;

  const categories = [
    "Semua Kategori", 
    "Jalan & Infrastruktur", 
    "Saluran Air", 
    "Kebersihan", 
    "Lainnya"
  ];

  const tabsMap: Record<string, string> = {
    "Semua": t.laporan.tabSemua,
    "Dalam Proses": t.laporan.tabProses,
    "Selesai": t.laporan.tabSelesai,
    "Ditolak": t.laporan.tabDitolak
  };

  const tabsKey = ["Semua", "Dalam Proses", "Selesai", "Ditolak"];

  useEffect(() => {
    setDaftarLaporan(getLaporan());
  }, []);

  // Reset page when tab, filter, or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, activeCategory, searchQuery]);

  // Filter laporan berdasarkan tab status dan kategori yang aktif
  let filteredLaporan = activeTab === "Semua" 
    ? daftarLaporan 
    : daftarLaporan.filter(laporan => laporan.status === activeTab);
    
  if (activeCategory !== "Semua Kategori") {
    filteredLaporan = filteredLaporan.filter(laporan => laporan.category === activeCategory);
  }

  // Filter berdasarkan kotak pencarian (ID atau Judul)
  if (searchQuery.trim() !== "") {
    const lowerQuery = searchQuery.toLowerCase();
    filteredLaporan = filteredLaporan.filter(laporan => 
      laporan.title.toLowerCase().includes(lowerQuery) || 
      laporan.id.toLowerCase().includes(lowerQuery)
    );
  }

  const totalPages = Math.ceil(filteredLaporan.length / ITEMS_PER_PAGE);
  const currentLaporan = filteredLaporan.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Fungsi untuk mendapatkan warna badge status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Dalam Proses":
        return "text-orange-500 bg-orange-50 border-orange-200";
      case "Selesai":
        return "text-green-500 bg-green-50 border-green-200";
      case "Ditolak":
        return "text-red-500 bg-red-50 border-red-200";
      default:
        return "text-slate-500 bg-slate-50 border-slate-200";
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-50 z-[-1]"></div>
      <div className="flex flex-col h-full pt-8">
      
      {/* 🔹 Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#0A2647] mb-1">{t.laporan.title}</h1>
          <p className="text-slate-600 text-sm">{t.laporan.desc}</p>
        </div>
        <Link 
          href="/buat" 
          className="inline-flex items-center gap-2 bg-[#124B8F] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0A2647] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> {t.laporan.btnBuat}
        </Link>
      </div>

      {/* 🔹 Tabs Navigasi */}
      <div className="flex gap-4 md:gap-8 border-b border-slate-300/50 mb-6 relative z-10 overflow-x-auto whitespace-nowrap no-scrollbar pb-1">
        {tabsKey.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab 
                ? "text-blue-600" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tabsMap[tab]}
            {activeTab === tab && (
              <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-blue-600 rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* 🔹 Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-20">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.laporan.cari} 
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-slate-700"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm min-w-[160px] text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> 
              {activeCategory === "Semua Kategori" ? t.laporan.filter : activeCategory}
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Dropdown Filter Kategori */}
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-3 pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori Laporan</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    activeCategory === cat 
                      ? "bg-blue-50 text-blue-700 font-semibold" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔹 List Laporan */}
      <div className="flex flex-col gap-4 relative z-10">
        {currentLaporan.length > 0 ? (
          currentLaporan.map((laporan) => (
            <Link 
              key={laporan.id} 
              href={`/laporan/${laporan.routeId}`}
              className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group"
            >
              {/* Thumbnail Laporan */}
              <div className="w-full sm:w-28 h-32 sm:h-[76px] bg-slate-200 rounded-lg overflow-hidden shrink-0">
                 {laporan.images && laporan.images.length > 0 ? (
                   <img src={laporan.images[0]} alt={laporan.title} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-slate-300"></div>
                 )}
              </div>

              {/* Info Laporan */}
              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-[#0A2647] mb-1 group-hover:text-blue-600 transition-colors">
                  {laporan.title}
                </h3>
                <p className="text-xs text-slate-500 mb-2">
                  {laporan.address}
                </p>
                <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
                  <span>{laporan.date}</span>
                  <span>{laporan.id}</span>
                </div>
              </div>

              {/* Status & Arrow */}
              <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 shrink-0 mt-2 sm:mt-0 border-t sm:border-0 border-slate-100 pt-3 sm:pt-0">
                <span className={`px-4 py-1.5 rounded-md text-xs font-bold border ${getStatusStyle(laporan.status)}`}>
                  {tabsMap[laporan.status] || laporan.status}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0A2647] transition-colors" />
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center">
            <p className="text-slate-500 font-medium">
              {t.laporan.belumAda.replace("{status}", tabsMap[activeTab])}
            </p>
          </div>
        )}
      </div>

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-8 mb-6 relative z-10">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            return (
              <button 
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg font-medium shadow-sm transition-colors ${
                  currentPage === pageNum
                    ? "bg-[#124B8F] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
    </>
  );
}