"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  Send,
  X,
  Megaphone,
} from "lucide-react";
import { useLanguage } from "@/utils/languageStorage";
import { createClient } from "@/lib/supabase/client";

type LaporanStatus =
  | "menunggu"
  | "diproses"
  | "selesai"
  | "ditolak"
  | "ditindaklanjuti"
  | "Dalam Proses"
  | "Selesai"
  | "Ditolak";

type Laporan = {
  id: string;
  judul: string | null;
  title?: string | null;
  status: LaporanStatus | string | null;
  created_at: string | null;
  updated_at?: string | null;
  handled_by?: string | null;
  user_id?: string | null;
};

type NotifikasiItem = {
  id: string;
  type: string;
  title: React.ReactNode;
  description: string;
  time: string;
  unread: boolean;
};

function formatTanggal(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NotifikasiPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [isAllRead, setIsAllRead] = useState(false);
  const [notifikasiList, setNotifikasiList] = useState<NotifikasiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifikasi = async () => {
      setLoading(true);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("laporan")
        .select("id, judul, status, created_at, updated_at, handled_by, user_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil notifikasi:", error.message);
        setNotifikasiList([]);
        setLoading(false);
        return;
      }

      const laporanList = (data ?? []) as Laporan[];

      const generatedNotif: NotifikasiItem[] = laporanList.map((laporan) => {
        const status = laporan.status?.toLowerCase();
        const judulLaporan = laporan.judul || laporan.title || "Laporan";

        let type = "diterima";
        let titleSuffix = t.notifikasi.items.diterima;
        let desc =
          "Laporan Anda telah berhasil kami terima dan akan segera diverifikasi.";

        if (status === "diproses" || status === "dalam proses") {
          type = "proses";
          titleSuffix = t.notifikasi.items.proses;
          desc = `Laporan Anda "${judulLaporan}" sedang ditindaklanjuti.`;
        } else if (status === "selesai") {
          type = "selesai";
          titleSuffix = t.notifikasi.items.selesai;
          desc = `Terima kasih! Laporan Anda "${judulLaporan}" telah diselesaikan.`;
        } else if (status === "ditolak") {
          type = "ditolak";
          titleSuffix = t.notifikasi.items.ditolak;
          desc = `Mohon maaf, laporan Anda "${judulLaporan}" tidak dapat diproses saat ini.`;
        } else if (status === "ditindaklanjuti") {
          type = "proses";
          titleSuffix = "sedang ditindaklanjuti";
          desc = `Laporan Anda "${judulLaporan}" sedang ditindaklanjuti oleh petugas.`;
        }

        return {
          id: laporan.id,
          type,
          title: (
            <>
              Laporan{" "}
              <span className="text-blue-500 font-semibold">
                #{laporan.id}
              </span>{" "}
              {titleSuffix}
            </>
          ),
          description: desc,
          time: formatTanggal(laporan.updated_at || laporan.created_at),
          unread: true,
        };
      });

      const systemNotif: NotifikasiItem = {
        id: "system-1",
        type: "sistem",
        title: (
          <span className="text-[#0A2647] font-bold">
            {t.notifikasi.items.sistem}
          </span>
        ),
        description:
          "Sistem akan melakukan pemeliharaan pada hari Minggu, 26 Mei 2026",
        time: "4 hari yang lalu",
        unread: false,
      };

      setNotifikasiList([...generatedNotif, systemNotif]);
      setLoading(false);
    };

    fetchNotifikasi();
  }, [router, t]);

  const getIconStyle = (type: string) => {
    switch (type) {
      case "proses":
        return {
          icon: <Clock className="w-6 h-6 text-[#F97316]" />,
          bg: "bg-[#FFEDD5]",
        };
      case "selesai":
        return {
          icon: <Check className="w-6 h-6 text-[#10B981]" strokeWidth={3} />,
          bg: "bg-[#D1FAE5]",
        };
      case "diterima":
        return {
          icon: <Send className="w-6 h-6 text-[#2563EB]" />,
          bg: "bg-[#DBEAFE]",
        };
      case "ditolak":
        return {
          icon: <X className="w-6 h-6 text-[#EF4444]" strokeWidth={3} />,
          bg: "bg-[#FEE2E2]",
        };
      case "sistem":
        return {
          icon: (
            <Megaphone
              className="w-6 h-6 text-[#1E40AF]"
              fill="currentColor"
            />
          ),
          bg: "bg-[#E0E7FF]",
        };
      default:
        return {
          icon: <Megaphone className="w-6 h-6 text-slate-500" />,
          bg: "bg-slate-100",
        };
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl relative z-10 -mt-2">
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-slate-600">
          Memuat notifikasi...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl relative z-10 -mt-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4 mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#0A2647] mb-2">
            {t.notifikasi.title}
          </h1>
          <p className="text-slate-600 text-[15px]">{t.notifikasi.desc}</p>
        </div>

        <button
          onClick={() => setIsAllRead(true)}
          className="inline-flex items-center gap-2 text-blue-500 font-semibold hover:text-blue-700 transition-colors"
        >
          <Check className="w-5 h-5" />
          {t.notifikasi.tandaiDibaca}
        </button>
      </div>

      <div className="bg-[#F8FAFC]/95 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {notifikasiList.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            Belum ada notifikasi.
          </div>
        ) : (
          notifikasiList.map((notif) => {
            const style = getIconStyle(notif.type);
            const isUnread = !isAllRead && notif.unread;

            return (
              <div
                key={notif.id}
                className={`flex items-start md:items-center gap-4 md:gap-5 p-4 md:p-6 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer ${isUnread ? "bg-white" : "bg-transparent"
                  }`}
              >
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 ${style.bg}`}
                >
                  {style.icon}
                </div>

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

                <div className="w-8 flex justify-end shrink-0">
                  {isUnread && (
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}