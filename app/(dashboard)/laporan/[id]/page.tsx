"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/utils/languageStorage";
import { createClient } from "@/lib/supabase/client";

type LaporanRow = {
  id: string;
  user_id?: string | null;

  judul?: string | null;
  title?: string | null;

  alamat?: string | null;
  address?: string | null;
  lokasi?: string | null;
  kecamatan?: string | null;

  created_at?: string | null;
  updated_at?: string | null;

  status?: string | null;

  kategori?: string | null;
  category?: string | null;

  prioritas?: string | null;
  priority?: string | null;

  deskripsi?: string | null;
  description?: string | null;

  images?: string[] | null;
  image_urls?: string[] | null;
  foto_url?: string | null;

  handled_by?: string | null;
  handledBy?: string | null;
};

type ProfileRow = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

export default function DetailLaporanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLanguage();

  const [report, setReport] = useState<LaporanRow | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailLaporan = async () => {
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
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Gagal mengambil detail laporan:", error.message);
        setReport(null);
        setLoading(false);
        return;
      }

      if (!data) {
        setReport(null);
        setLoading(false);
        return;
      }

      const laporanData = data as LaporanRow;
      setReport(laporanData);

      if (laporanData.user_id) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, email, phone")
          .eq("id", laporanData.user_id)
          .maybeSingle();

        if (profileError) {
          console.error("Gagal mengambil profil pelapor:", profileError.message);
        } else {
          setProfile(profileData as ProfileRow | null);
        }
      }

      setLoading(false);
    };

    fetchDetailLaporan();
  }, [id, router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "diproses":
      case "dalam proses":
      case "ditindaklanjuti":
        return "bg-[#FFEDD5] text-[#F97316] border-[#FFDBB5]";
      case "selesai":
        return "bg-green-50 text-green-600 border-green-200";
      case "ditolak":
        return "bg-red-50 text-red-600 border-red-200";
      case "menunggu":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "diproses":
      case "dalam proses":
      case "ditindaklanjuti":
        return "text-[#F97316]";
      case "selesai":
        return "text-green-600";
      case "ditolak":
        return "text-red-600";
      case "menunggu":
        return "text-yellow-600";
      default:
        return "text-slate-600";
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 bg-slate-50 z-[-1]" />
        <div className="flex flex-col h-full pt-6 pb-20 font-sans items-center justify-center">
          <p className="text-slate-500 font-medium text-lg">
            {t.detail.memuat}
          </p>
        </div>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <div className="fixed inset-0 bg-slate-50 z-[-1]" />
        <div className="flex flex-col h-full pt-6 pb-20 font-sans items-center justify-center">
          <p className="text-slate-500 font-medium text-lg">
            Laporan tidak ditemukan.
          </p>

          <Link
            href="/laporan"
            className="mt-4 text-[#124B8F] font-bold hover:text-[#0A2647]"
          >
            Kembali ke Laporan
          </Link>
        </div>
      </>
    );
  }

  const title = report.judul || report.title || "Laporan Tanpa Judul";
  const address =
    report.alamat ||
    report.address ||
    report.lokasi ||
    report.kecamatan ||
    "Lokasi tidak diketahui";

  const status = report.status || "menunggu";
  const category = report.kategori || report.category || "-";
  const priority = report.prioritas || report.priority || "-";
  const description = report.deskripsi || report.description || "-";

  const author = profile?.full_name || "Pengguna";
  const contact = profile?.phone || "-";

  const handledBy = report.handled_by || report.handledBy || "Menunggu Verifikasi";

  const reportImages =
    report.images ||
    report.image_urls ||
    (report.foto_url ? [report.foto_url] : []);

  return (
    <>
      <div className="fixed inset-0 bg-slate-50 z-[-1]" />

      <div className="flex flex-col h-full pt-6 pb-20 font-sans relative z-10 text-slate-800">
        <Link
          href="/laporan"
          className="inline-flex items-center gap-2 text-[#124B8F] font-bold mb-8 text-[16px] hover:text-[#0A2647] transition-colors w-fit"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          {t.detail.kembali}
        </Link>

        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
          <div className="flex-1 flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-[320px] h-48 lg:h-[200px] rounded-xl overflow-hidden shrink-0 relative bg-slate-200">
              {reportImages.length > 0 ? (
                <img
                  src={reportImages[0]}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600&h=400"
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-1 pt-1">
              <h1 className="text-[28px] font-bold text-[#0A2647] leading-tight mb-5">
                {title}
              </h1>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#124B8F]">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[15px] font-medium">
                      #{report.id}
                    </span>
                  </div>

                  <span
                    className={`px-5 py-1.5 rounded-md text-[13px] font-semibold border ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[14px] font-medium text-slate-600">
                    {address}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-[14px] font-medium text-slate-600">
                    Dilaporkan pada {formatDate(report.created_at)},{" "}
                    {formatTime(report.created_at)} WIB
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[340px] bg-[#FCFCFD] rounded-[10px] border border-slate-300 p-6 shrink-0 h-fit shadow-sm">
            <h2 className="text-[18px] font-bold text-[#0A2647] mb-6">
              {t.detail.infoTitle}
            </h2>

            <div className="grid grid-cols-[120px_1fr] gap-y-4 text-[14px]">
              <span className="text-slate-600 font-medium">
                {t.detail.kategori}
              </span>
              <span className="text-slate-600 font-bold">{category}</span>

              <span className="text-slate-600 font-medium">
                {t.detail.prioritas}
              </span>
              <span className="text-slate-600 font-bold">{priority}</span>

              <span className="text-slate-600 font-medium">
                {t.detail.dibuatOleh}
              </span>
              <span className="text-slate-600 font-bold">{author}</span>

              <span className="text-slate-600 font-medium">
                {t.detail.kontak}
              </span>
              <span className="text-slate-600 font-bold">{contact}</span>

              <span className="text-slate-600 font-medium">
                {t.detail.status}
              </span>
              <span className={`font-bold ${getStatusTextColor(status)}`}>
                {status}
              </span>

              <span className="text-slate-600 font-medium">
                {t.detail.ditangani}
              </span>
              <span className="text-slate-600 font-bold">{handledBy}</span>
            </div>
          </div>
        </div>

        <hr className="border-t border-slate-200 mb-8" />

        <div className="mb-8">
          <h2 className="text-[17px] font-bold text-[#0A2647] mb-3">
            {t.detail.deskripsi}
          </h2>

          <p className="text-[15px] text-slate-500 leading-relaxed font-medium">
            {description}
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-[17px] font-bold text-[#0A2647] mb-4">
            {t.detail.foto}
          </h2>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            {reportImages.length > 0 ? (
              <>
                {reportImages.slice(0, 3).map((imgUrl, index) => (
                  <div
                    key={index}
                    className="w-[calc(50%-6px)] sm:w-[200px] h-28 sm:h-[130px] rounded-xl overflow-hidden bg-slate-200 border border-slate-200"
                  >
                    <img
                      src={imgUrl}
                      alt={`Foto Bukti ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {reportImages.length > 3 && (
                  <div className="w-[calc(50%-6px)] sm:w-[200px] h-28 sm:h-[130px] rounded-xl bg-[#E2E2E2] flex items-center justify-center cursor-pointer hover:bg-[#D4D4D4] transition-colors">
                    <span className="text-2xl sm:text-3xl font-bold text-[#8E8E8E]">
                      +{reportImages.length - 3}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="w-[calc(50%-6px)] sm:w-[200px] h-28 sm:h-[130px] rounded-xl overflow-hidden bg-slate-200"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400&h=300"
                      alt="Foto Bukti"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                <div className="w-[calc(50%-6px)] sm:w-[200px] h-28 sm:h-[130px] rounded-xl bg-[#E2E2E2] flex items-center justify-center cursor-pointer hover:bg-[#D4D4D4] transition-colors">
                  <span className="text-2xl sm:text-3xl font-bold text-[#8E8E8E]">
                    +2
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <hr className="border-t border-slate-200 mb-10" />

        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="flex-1">
            <h2 className="text-[17px] font-bold text-[#0A2647] mb-4">
              {t.detail.riwayat}
            </h2>
          </div>

          <div className="w-full lg:w-[360px] bg-[#F4F7FB] rounded-xl p-6">
            <h3 className="text-[15px] font-bold text-[#0A2647] mb-3">
              {t.detail.tambahInfoTitle}
            </h3>

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