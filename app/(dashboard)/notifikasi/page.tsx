"use client"

import { useState, useEffect } from "react";
import { 
  Check, 
  Clock, 
  Send, 
  X, 
  Megaphone 
} from "lucide-react";
import { useLanguage } from "@/utils/languageStorage";
import { getLaporan, Laporan } from "@/utils/laporanStorage";
import { getCurrentUser } from "@/utils/authStorage";

export default function NotifikasiPage() {
  const { t } = useLanguage();
  // State dummy untuk simulasi "Tandai semua sudah dibaca"
  const [isAllRead, setIsAllRead] = useState(false);

  // Data Dummy Notifikasi yang diambil dari Laporan
  const [notifikasiList, setNotifikasiList] = useState<any[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    const allLaporan = getLaporan();
    // Tampilkan semua laporan (termasuk dummy sebelumnya) sebagai notifikasi
    const userLaporan = allLaporan;

    const generatedNotif = userLaporan.map((laporan, index) => {
      let type = "diterima";
      let titleSuffix = t.notifikasi.items.diterima;
      let desc = "Laporan Anda telah berhasil kami terima dan akan segera diverifikasi.";

      if (laporan.status === "Dalam Proses") {
        type = "proses";
        titleSuffix = t.notifikasi.items.proses;
        desc = `Laporan Anda "${laporan.title}" sedang ditindaklanjuti oleh ${laporan.handledBy}.`;
      } else if (laporan.status === "Selesai") {
        type = "selesai";
        titleSuffix = t.notifikasi.items.selesai;
        desc = `Terima kasih! Laporan Anda "${laporan.title}" telah diselesaikan.`;
      } else if (laporan.status === "Ditolak") {
        type = "ditolak";
        titleSuffix = t.notifikasi.items.ditolak;
        desc = `Mohon maaf, laporan Anda "${laporan.title}" tidak dapat diproses saat ini.`;
      }

      return {
        id: laporan.id,
        type: type,
        title: (
          <>Laporan <span className="text-blue-500 font-semibold">#{laporan.id}</span> {titleSuffix}</>
        ),
        description: desc,
        time: laporan.date,
        unread: true // secara default anggap belum dibaca
      };
    });

    // Tambahkan 1 notifikasi sistem sebagai pemanis
    const systemNotif = {
      id: "system-1",
      type: "sistem",
      title: <span className="text-[#0A2647] font-bold">{t.notifikasi.items.sistem}</span>,
      description: "Sistem akan melakukan pemeliharaan pada hari Minggu, 26 Mei 2026",
      time: "4 hari yang lalu",
      unread: false,
    };

    setNotifikasiList([...generatedNotif, systemNotif]);
  }, [t]);

  // Helper untuk mendapatkan ikon dan warna background berdasarkan tipe notifikasi
  const getIconStyle = (type: string) => {
    switch (type) {
      case "proses":
        return {
          icon: <Clock className="w-6 h-6 text-[#F97316]" />, // Oranye
          bg: "bg-[#FFEDD5]",
        };
      case "selesai":
        return {
          icon: <Check className="w-6 h-6 text-[#10B981]" strokeWidth={3} />, // Hijau
          bg: "bg-[#D1FAE5]",
        };
      case "diterima":
        return {
          icon: <Send className="w-6 h-6 text-[#2563EB]" />, // Biru
          bg: "bg-[#DBEAFE]",
        };
      case "ditolak":
        return {
          icon: <X className="w-6 h-6 text-[#EF4444]" strokeWidth={3} />, // Merah
          bg: "bg-[#FEE2E2]",
        };
      case "sistem":
        return {
          icon: <Megaphone className="w-6 h-6 text-[#1E40AF]" fill="currentColor" />, // Biru Tua (Megaphone)
          bg: "bg-[#E0E7FF]",
        };
      default:
        return {
          icon: <Megaphone className="w-6 h-6 text-slate-500" />,
          bg: "bg-slate-100",
        };
    }
  };

  return (
    <div className="max-w-5xl relative z-10 -mt-2">
      
      {/* 🔹 Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4 mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#0A2647] mb-2">{t.notifikasi.title}</h1>
          <p className="text-slate-600 text-[15px]">{t.notifikasi.desc}</p>
        </div>
        <button 
          onClick={() => setIsAllRead(true)}
          className="inline-flex items-center gap-2 text-blue-500 font-semibold hover:text-blue-700 transition-colors"
        >
          <Check className="w-5 h-5" /> {t.notifikasi.tandaiDibaca}
        </button>
      </div>

      {/* 🔹 Container List Notifikasi */}
      <div className="bg-[#F8FAFC]/95 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {notifikasiList.map((notif, index) => {
          const style = getIconStyle(notif.type);
          const isUnread = !isAllRead && notif.unread;

          return (
            <div 
              key={notif.id} 
              className={`flex items-start md:items-center gap-4 md:gap-5 p-4 md:p-6 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer ${
                isUnread ? "bg-white" : "bg-transparent"
              }`}
            >
              {/* Ikon Notifikasi */}
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 ${style.bg}`}>
                {style.icon}
              </div>

              {/* Konten Notifikasi */}
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#0A2647] mb-1.5">
                  {notif.title}
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  {notif.description}
                </p>
                <span className="text-xs text-slate-500 font-medium">
                  {notif.time}
                </span>
              </div>

              {/* Indikator Belum Dibaca (Titik Biru) */}
              <div className="w-8 flex justify-end shrink-0">
                {isUnread && (
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}