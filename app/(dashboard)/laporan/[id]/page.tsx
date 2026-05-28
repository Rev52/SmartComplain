"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { getLaporanById, Laporan } from "@/utils/laporanStorage";
import { useLanguage } from "@/utils/languageStorage";

export default function DetailLaporanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<Laporan | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    setReport(getLaporanById(id) || null);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Dalam Proses":
        return "bg-[#FFEDD5] text-[#F97316] border-[#FFDBB5]";
      case "Selesai":
        return "bg-green-50 text-green-600 border-green-200";
      case "Ditolak":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Dalam Proses": return "text-[#F97316]";
      case "Selesai": return "text-green-600";
      case "Ditolak": return "text-red-600";
      default: return "text-slate-600";
    }
  };

  if (!report) {
    return (
      <>
      <div className="fixed inset-0 bg-slate-50 z-[-1]"></div>
        <div className="flex flex-col h-full pt-6 pb-20 font-sans items-center justify-center">
          <p className="text-slate-500 font-medium text-lg">{t.detail.memuat}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-slate-50 z-[-1]"></div>
      <div className="flex flex-col h-full pt-6 pb-20 font-sans relative z-10 text-slate-800">
      {/* Tombol Kembali */}
      <Link 
        href="/laporan" 
        className="inline-flex items-center gap-2 text-[#124B8F] font-bold mb-8 text-[16px] hover:text-[#0A2647] transition-colors w-fit"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.5]" /> {t.detail.kembali}
      </Link>

      {/* Konten Atas: Kiri (Gambar & Info) + Kanan (Card Informasi) */}
      <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
        
        {/* Kolom Kiri */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6">
          {/* Gambar Thumbnail Besar */}
          <div className="w-full lg:w-[320px] h-48 lg:h-[200px] rounded-xl overflow-hidden shrink-0 relative bg-slate-200">
            {report.images && report.images.length > 0 ? (
              <img 
                src={report.images[0]} 
                alt={report.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600&h=400" 
                alt={report.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Judul & Detail */}
          <div className="flex-1 pt-1">
            <h1 className="text-[28px] font-bold text-[#0A2647] leading-tight mb-5">
              {report.title}
            </h1>
            
            <div className="flex flex-col gap-4">
              {/* SP & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#124B8F]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[15px] font-medium">{report.id}</span>
                </div>
                <span className={`px-5 py-1.5 rounded-md text-[13px] font-semibold border ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>

              {/* Lokasi */}
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-4 h-4" />
                <span className="text-[14px] font-medium text-slate-600">{report.address}</span>
              </div>

              {/* Waktu */}
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4" />
                <span className="text-[14px] font-medium text-slate-600">Dilaporkan pada {report.date}, {report.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Card Informasi Laporan */}
        <div className="w-full lg:w-[340px] bg-[#FCFCFD] rounded-[10px] border border-slate-300 p-6 shrink-0 h-fit shadow-sm">
          <h2 className="text-[18px] font-bold text-[#0A2647] mb-6">{t.detail.infoTitle}</h2>
          
          <div className="grid grid-cols-[120px_1fr] gap-y-4 text-[14px]">
            <span className="text-slate-600 font-medium">{t.detail.kategori}</span>
            <span className="text-slate-600 font-bold">{report.category}</span>
            
            <span className="text-slate-600 font-medium">{t.detail.prioritas}</span>
            <span className="text-slate-600 font-bold">{report.priority}</span>
            
            <span className="text-slate-600 font-medium">{t.detail.dibuatOleh}</span>
            <span className="text-slate-600 font-bold">{report.author}</span>
            
            <span className="text-slate-600 font-medium">{t.detail.kontak}</span>
            <span className="text-slate-600 font-bold">{report.contact}</span>
            
            <span className="text-slate-600 font-medium">{t.detail.status}</span>
            <span className={`font-bold ${getStatusTextColor(report.status)}`}>{report.status}</span>
            
            <span className="text-slate-600 font-medium">{t.detail.ditangani}</span>
            <span className="text-slate-600 font-bold">{report.handledBy}</span>
          </div>
        </div>
        
      </div>

      <hr className="border-t border-slate-200 mb-8" />

      {/* Deskripsi Laporan */}
      <div className="mb-8">
        <h2 className="text-[17px] font-bold text-[#0A2647] mb-3">{t.detail.deskripsi}</h2>
        <p className="text-[15px] text-slate-500 leading-relaxed font-medium">
          {report.description}
        </p>
      </div>

      {/* Foto Bukti */}
      <div className="mb-10">
        <h2 className="text-[17px] font-bold text-[#0A2647] mb-4">{t.detail.foto}</h2>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {report.images && report.images.length > 0 ? (
            <>
              {report.images.slice(0, 3).map((imgUrl, index) => (
                <div key={index} className="w-[calc(50%-6px)] sm:w-[200px] h-28 sm:h-[130px] rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                  <img 
                    src={imgUrl} 
                    alt={`Foto Bukti ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {report.images.length > 3 && (
                <div className="w-[calc(50%-6px)] sm:w-[200px] h-28 sm:h-[130px] rounded-xl bg-[#E2E2E2] flex items-center justify-center cursor-pointer hover:bg-[#D4D4D4] transition-colors">
                  <span className="text-2xl sm:text-3xl font-bold text-[#8E8E8E]">+{report.images.length - 3}</span>
                </div>
              )}
            </>
          ) : (
            <>
              {[1, 2, 3].map((item) => (
                <div key={item} className="w-[calc(50%-6px)] sm:w-[200px] h-28 sm:h-[130px] rounded-xl overflow-hidden bg-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400&h=300" 
                    alt="Foto Bukti"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {/* Box +2 */}
              <div className="w-[calc(50%-6px)] sm:w-[200px] h-28 sm:h-[130px] rounded-xl bg-[#E2E2E2] flex items-center justify-center cursor-pointer hover:bg-[#D4D4D4] transition-colors">
                <span className="text-2xl sm:text-3xl font-bold text-[#8E8E8E]">+2</span>
              </div>
            </>
          )}
        </div>
      </div>

      <hr className="border-t border-slate-200 mb-10" />

      {/* Riwayat Laporan & Tambah Informasi */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <h2 className="text-[17px] font-bold text-[#0A2647] mb-4">{t.detail.riwayat}</h2>
          {/* Area ini kosong sesuai dengan gambar referensi */}
        </div>

        {/* Card Tambah Informasi */}
        <div className="w-full lg:w-[360px] bg-[#F4F7FB] rounded-xl p-6">
          <h3 className="text-[15px] font-bold text-[#0A2647] mb-3">{t.detail.tambahInfoTitle}</h3>
          <p className="text-[14px] text-slate-600 font-medium mb-6 leading-relaxed">
            {t.detail.tambahInfoDesc}
          </p>
          <button className="w-fit bg-transparent border border-[#124B8F] text-[#124B8F] font-bold text-[14px] px-5 py-2.5 rounded-lg hover:bg-[#E8F0FE] transition-colors">
            {t.detail.btnTambah}
          </button>
        </div>
      </div>
      
    </div>
    </>
  );
}
