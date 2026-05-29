"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Edit3,
} from "lucide-react";
import { useLanguage } from "@/utils/languageStorage";
import { createClient } from "@/lib/supabase/client";

type Laporan = {
  id: string;
  user_id: string | null;
  judul: string | null;
  deskripsi: string | null;
  kategori: string | null;
  prioritas: string | null;
  status: string | null;
  lokasi: string | null;
  kecamatan: string | null;
  foto_url: string[] | null;
  created_at: string | null;
};

type Stats = {
  total: number;
  proses: number;
  selesai: number;
  ditolak: number;
};

export default function BerandaPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [stats, setStats] = useState<Stats>({
    total: 0,
    proses: 0,
    selesai: 0,
    ditolak: 0,
  });

  const [laporanTerbaru, setLaporanTerbaru] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
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
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data beranda:", error.message);
        setLoading(false);
        return;
      }

      const laporan = (data ?? []) as Laporan[];

      const proses = laporan.filter((item) => {
        const status = item.status?.toLowerCase();

        return (
          status === "menunggu" ||
          status === "diproses" ||
          status === "ditindaklanjuti" ||
          status === "dalam proses"
        );
      }).length;

      const selesai = laporan.filter(
        (item) => item.status?.toLowerCase() === "selesai"
      ).length;

      const ditolak = laporan.filter(
        (item) => item.status?.toLowerCase() === "ditolak"
      ).length;

      setStats({
        total: laporan.length,
        proses,
        selesai,
        ditolak,
      });

      setLaporanTerbaru(laporan.slice(0, 4));
      setLoading(false);
    };

    fetchDashboardData();
  }, [router]);

  const formatDate = (date: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getImage = (laporan: Laporan, index: number) => {
    if (laporan.foto_url && laporan.foto_url.length > 0) {
      return laporan.foto_url[0];
    }

    const fallbackImages = [
      "/beranda 1.png",
      "/beranda 2.png",
      "/beranda 3.png",
      "/beranda 4.png",
    ];

    return fallbackImages[index] || "/beranda 1.png";
  };

  const selesaiPercent =
    stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0;

  const prosesPercent =
    stats.total > 0 ? Math.round((stats.proses / stats.total) * 100) : 0;

  const ditolakPercent =
    stats.total > 0 ? Math.round((stats.ditolak / stats.total) * 100) : 0;

  const selesaiEnd = selesaiPercent;
  const prosesEnd = selesaiPercent + prosesPercent;

  return (
    <div className="space-y-6">
      {/* Baris 1: Statistik Angka */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        <div className="bg-white/95 p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText className="w-7 h-7" />
          </div>

          <div>
            <p className="text-slate-500 text-[10px] md:text-xs font-medium mb-0.5">
              {t.beranda.total}
            </p>

            <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2">
              <h3 className="text-2xl font-bold text-[#0A2647]">
                {stats.total}
              </h3>
              <span className="text-[10px] text-slate-400">
                {t.beranda.totalDesc}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/95 p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
            <Clock className="w-7 h-7" />
          </div>

          <div>
            <p className="text-slate-500 text-[10px] md:text-xs font-medium mb-0.5">
              {t.beranda.proses}
            </p>

            <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2">
              <h3 className="text-2xl font-bold text-[#0A2647]">
                {stats.proses}
              </h3>
              <span className="text-[10px] text-slate-400">
                {t.beranda.prosesDesc}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/95 p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-500 rounded-xl">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <p className="text-slate-500 text-[10px] md:text-xs font-medium mb-0.5">
              {t.beranda.selesai}
            </p>

            <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2">
              <h3 className="text-2xl font-bold text-[#0A2647]">
                {stats.selesai}
              </h3>
              <span className="text-[10px] text-slate-400">
                {t.beranda.selesaiDesc}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/95 p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <XCircle className="w-7 h-7" />
          </div>

          <div>
            <p className="text-slate-500 text-[10px] md:text-xs font-medium mb-0.5">
              {t.beranda.ditolak}
            </p>

            <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-2">
              <h3 className="text-2xl font-bold text-[#0A2647]">
                {stats.ditolak}
              </h3>
              <span className="text-[10px] text-slate-400">
                {t.beranda.ditolakDesc}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Baris 2: Laporan Terbaru & Statistik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/95 rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#0A2647]">{t.beranda.terbaru}</h3>

            <Link
              href="/laporan"
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              {t.beranda.lihatSemua}
            </Link>
          </div>

          <div className="space-y-5">
            {loading ? (
              <p className="text-sm text-slate-500">Memuat laporan...</p>
            ) : laporanTerbaru.length > 0 ? (
              laporanTerbaru.map((item, idx) => (
                <Link
                  key={item.id}
                  href={`/laporan/${item.id}`}
                  className="flex gap-4 items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0 group"
                >
                  <div className="w-24 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0 relative">
                    <Image
                      src={getImage(item, idx)}
                      alt={item.judul || "Laporan"}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#0A2647] mb-1 group-hover:text-blue-600 transition-colors">
                      {item.judul || "Laporan Tanpa Judul"}
                    </h4>

                    <p className="text-[11px] text-slate-500 mb-2">
                      {item.lokasi ||
                        item.kecamatan ||
                        "Lokasi tidak diketahui"}
                    </p>

                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium">
                      <span>{formatDate(item.created_at)}</span>
                      <span>#{item.id}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500 mb-3">
                  Belum ada laporan.
                </p>

                <Link
                  href="/buat"
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline"
                >
                  Buat laporan pertama
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/95 rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-[#0A2647]">{t.beranda.statistik}</h3>

            <Link
              href="/laporan"
              className="text-xs text-blue-600 font-semibold flex items-center hover:underline"
            >
              {t.beranda.lihatDetail}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div
              className="relative w-44 aspect-square shrink-0 rounded-full bg-slate-100 overflow-hidden"
              style={{
                background:
                  stats.total > 0
                    ? `conic-gradient(
                        #10B981 0% ${selesaiEnd}%,
                        #F97316 ${selesaiEnd}% ${prosesEnd}%,
                        #EF4444 ${prosesEnd}% 100%
                      )`
                    : undefined,
              }}
            >
              <div className="absolute inset-1/2 h-20 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </div>

            <div className="grid grid-cols-1 gap-3 w-full max-w-[260px]">
              <div className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <span className="font-semibold text-slate-600">
                    {t.beranda.selesai}
                  </span>
                </div>

                <span className="text-slate-400">
                  {stats.selesai} ({selesaiPercent}%)
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#F97316]" />
                  <span className="font-semibold text-slate-600">
                    {t.beranda.proses}
                  </span>
                </div>

                <span className="text-slate-400">
                  {stats.proses} ({prosesPercent}%)
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="font-semibold text-slate-600">
                    {t.beranda.ditolak}
                  </span>
                </div>

                <span className="text-slate-400">
                  {stats.ditolak} ({ditolakPercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Baris 3: Banner Informasi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#F0F5FF] rounded-2xl p-6 flex justify-between items-center overflow-hidden relative min-h-[180px]">
          <div className="relative z-20 max-w-[72%] pr-6">
            <h3 className="font-bold text-[#0A2647] text-lg mb-2">
              {t.beranda.bannerTitle}
            </h3>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              {t.beranda.bannerDesc}
            </p>

            <Link
              href="/buat"
              className="inline-flex items-center text-sm font-semibold text-blue-600 bg-white border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {t.beranda.btnBuat}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="absolute right-3 md:right-6 bottom-8 z-0 hidden sm:block opacity-95">
            <Image
              src="/HP 2 beranda.png"
              alt="Ilustrasi App"
              width={120}
              height={120}
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>

        <div className="bg-[#E6F9F0] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden text-center sm:text-left">
          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 z-10 relative">
            <Image
              src="/TIPS.png"
              alt="Tips"
              fill
              className="object-contain drop-shadow-sm"
            />
          </div>

          <div className="z-10">
            <h3 className="font-bold text-green-800 mb-1.5 text-base">
              {t.beranda.tipsTitle}
            </h3>

            <p className="text-sm text-green-700/80 leading-relaxed">
              {t.beranda.tipsDesc}
            </p>
          </div>

          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-200/40 rounded-full blur-xl" />
        </div>
      </div>
    </div>
  );
}
