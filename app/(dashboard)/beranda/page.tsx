"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, Clock, CheckCircle2, XCircle, ArrowRight, Edit3 } from "lucide-react";
import { getLaporan } from "@/utils/laporanStorage";
import { useLanguage } from "@/utils/languageStorage";

export default function BerandaPage() {
  const [stats, setStats] = useState({ total: 0, proses: 0, selesai: 0, ditolak: 0 });
  const { t } = useLanguage();

  useEffect(() => {
    const list = getLaporan();
    setStats({
      total: list.length,
      proses: list.filter(l => l.status === "Dalam Proses").length,
      selesai: list.filter(l => l.status === "Selesai").length,
      ditolak: list.filter(l => l.status === "Ditolak").length,
    });
  }, []);
  return (
    <div className="space-y-6">
      
      {/* 🔹 Baris 1: Statistik Angka */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        <div className="bg-white/95 p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText className="w-7 h-7" /></div>
          <div>
            <p className="text-slate-500 text-[10px] md:text-xs font-medium mb-0.5">{t.beranda.total}</p>
            <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2">
              <h3 className="text-2xl font-bold text-[#0A2647]">{stats.total}</h3>
              <span className="text-[10px] text-slate-400">{t.beranda.totalDesc}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/95 p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Clock className="w-7 h-7" /></div>
          <div>
            <p className="text-slate-500 text-[10px] md:text-xs font-medium mb-0.5">{t.beranda.proses}</p>
            <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2">
              <h3 className="text-2xl font-bold text-[#0A2647]">{stats.proses}</h3>
              <span className="text-[10px] text-slate-400">{t.beranda.prosesDesc}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/95 p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-500 rounded-xl"><CheckCircle2 className="w-7 h-7" /></div>
          <div>
            <p className="text-slate-500 text-[10px] md:text-xs font-medium mb-0.5">{t.beranda.selesai}</p>
            <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2">
              <h3 className="text-2xl font-bold text-[#0A2647]">{stats.selesai}</h3>
              <span className="text-[10px] text-slate-400">{t.beranda.selesaiDesc}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/95 p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl"><XCircle className="w-7 h-7" /></div>
          <div>
            <p className="text-slate-500 text-[10px] md:text-xs font-medium mb-0.5">{t.beranda.ditolak}</p>
            <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2">
              <h3 className="text-2xl font-bold text-[#0A2647]">{stats.ditolak}</h3>
              <span className="text-[10px] text-slate-400">{t.beranda.ditolakDesc}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Baris 2: List Laporan & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Laporan Terbaru */}
        <div className="lg:col-span-2 bg-white/95 rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#0A2647]">{t.beranda.terbaru}</h3>
            <Link href="/laporan" className="text-xs text-blue-600 font-semibold hover:underline">{t.beranda.lihatSemua}</Link>
          </div>
          
          <div className="space-y-5">
            {[
              { title: "Jalan Berlubang di Jl. Jagir Wonokromo", address: "Jl. Jagir No.20, Wonokromo, Surabaya", date: "23 Mei 2026", id: "SP-230-...", image: "/beranda 1.png" },
              { title: "Banjir di Jl. Trenggilis Mulya", address: "Jl. Trenggilis Mulya No.40, Surabaya", date: "20 Mei 2026", id: "SP-230-...", image: "/beranda 2.png" },
              { title: "Proyek Tertunda di kawasan Sukomanunggal", address: "Sukomanunggal, Surabaya", date: "18 Mei 2026", id: "SP-230-...", image: "/beranda 3.png" },
              { title: "Tumpukan Sampah Rumah Tangga di Jemur Gayungan", address: "Jemur Gayungan, Surabaya", date: "15 Mei 2026", id: "SP-230-...", image: "/beranda 4.png" }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className="w-24 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0 relative">
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#0A2647] mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mb-2">{item.address}</p>
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium">
                    <span>{item.date}</span>
                    <span>{item.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistik Laporan (Pie Chart Custom) */}
        <div className="bg-white/95 rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-[#0A2647]">{t.beranda.statistik}</h3>
            <Link href="/laporan/statistik" className="text-xs text-blue-600 font-semibold flex items-center hover:underline">
              {t.beranda.lihatDetail} <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {/* Donut Chart CSS Only */}
            <div className="relative w-40 h-40 rounded-full bg-slate-100" 
                 style={{ 
                   background: stats.total > 0 
                     ? `conic-gradient(#10B981 0% ${Math.round((stats.selesai / stats.total) * 100)}%, #F97316 ${Math.round((stats.selesai / stats.total) * 100)}% ${Math.round(((stats.selesai + stats.proses) / stats.total) * 100)}%, #EF4444 ${Math.round(((stats.selesai + stats.proses) / stats.total) * 100)}% 100%)` 
                     : undefined
                 }}>
              <div className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full"></div>
            </div>

            {/* Legend */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-slate-600 font-medium">{t.beranda.selesai}</span></div>
                <span className="text-slate-400">{stats.selesai} ({stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0}%)</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span><span className="text-slate-600 font-medium">{t.beranda.proses}</span></div>
                <span className="text-slate-400">{stats.proses} ({stats.total > 0 ? Math.round((stats.proses / stats.total) * 100) : 0}%)</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="text-slate-600 font-medium">{t.beranda.ditolak}</span></div>
                <span className="text-slate-400">{stats.ditolak} ({stats.total > 0 ? Math.round((stats.ditolak / stats.total) * 100) : 0}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Baris 3: Banner Informasi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-[#F0F5FF] rounded-2xl p-6 flex justify-between items-center overflow-hidden relative">
          <div className="z-10 max-w-sm">
            <h3 className="font-bold text-[#0A2647] text-lg mb-2">{t.beranda.bannerTitle}</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              {t.beranda.bannerDesc}
            </p>
            <Link href="/buat" className="inline-flex items-center text-sm font-semibold text-blue-600 bg-white border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              <Edit3 className="w-4 h-4 mr-2" /> {t.beranda.btnBuat} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {/* Ilustrasi HP */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-0 hidden sm:block">
             <Image src="/HP 2 beranda.png" alt="Ilustrasi App" width={140} height={140} className="object-contain drop-shadow-xl" />
          </div>
        </div>

        <div className="bg-[#E6F9F0] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden text-center sm:text-left">
          {/* Icon Tips */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 z-10 relative">
            <Image src="/TIPS.png" alt="Tips" fill className="object-contain drop-shadow-sm" />
          </div>
          <div className="z-10">
            <h3 className="font-bold text-green-800 mb-1.5 text-base">{t.beranda.tipsTitle}</h3>
            <p className="text-sm text-green-700/80 leading-relaxed">
              {t.beranda.tipsDesc}
            </p>
          </div>
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-200/40 rounded-full blur-xl"></div>
        </div>

      </div>

    </div>
  );
}