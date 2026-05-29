import Navbar from "@/component/layout/Navbar";
import Footer from "@/component/layout/Footer";
import {
  MousePointerClick,
  Search,
  Sparkles,
  Cpu,
  CheckSquare,
  MapPin,
  FileEdit,
  CloudUpload,
  RefreshCw,
  CheckCircle,
  MessageSquare,
  Clock,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex flex-col items-center justify-center pt-20 px-8">
        <div className="absolute inset-0 z-0 bg-blue-100">
          <Image
            src="/Landingpage Background.png"
            alt="Surabaya Tugu Pahlawan"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-white/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-[#0A2647] leading-tight mb-4">
              Platform Pengaduan <br /> Fasilitas Publik
            </h1>
            <p className="text-lg text-slate-700 mb-8 max-w-md">
              Laporkan fasilitas publik di Surabaya dengan mudah untuk warga
              Surabaya yang lebih baik.
            </p>
            <Link
              href="/login"
              className="bg-[#0A2647] text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-900 transition-colors"
            >
              Mulai
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Floating Cards */}
      <div className="relative z-20 max-w-5xl mx-auto -mt-16 bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#0A2647] mb-1">Mudah Digunakan</h3>
            <p className="text-sm text-slate-500 text-balance">
              Laporkan keluhan hanya dalam beberapa langkah sederhana.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#0A2647] mb-1">Pantau Laporan</h3>
            <p className="text-sm text-slate-500 text-balance">
              Pantau status laporan Anda secara real-time hingga selesai.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#0A2647] mb-1">Transparan</h3>
            <p className="text-sm text-slate-500 text-balance">
              Setiap laporan ditindaklanjuti secara terbuka dan dapat dipantau
              warga.
            </p>
          </div>
        </div>
      </div>

      {/* Tentang Section */}
      <section
        id="tentang"
        className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
      >
        <div>
          <h4 className="text-blue-600 font-bold text-sm mb-2 uppercase">
            Tentang SmartComplain
          </h4>
          <h2 className="text-3xl font-bold text-[#0A2647] mb-6">
            SmartComplain untuk Surabaya yang Lebih Baik
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            SmartComplain membantu masyarakat Surabaya melaporkan fasilitas
            publik rusak secara cepat dan transparan. SmartComplain juga
            membantu menciptakan kota Surabaya yang lebih aman, nyaman, dan
            responsif melalui platform pengaduan digital modern.
          </p>
          <Link
            href="#fitur"
            className="bg-[#0A2647] text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-900 transition-colors inline-block"
          >
            Selengkapnya
          </Link>
        </div>
        <div className="relative h-[500px] bg-slate-100 rounded-2xl flex items-center justify-center">
          <Image
            src="/landingpage image2.png"
            alt="Mobile App Mockup"
            width={600}
            height={600}
            className="object-contain drop-shadow-2xl z-10"
          />
        </div>
      </section>

      {/* Fitur Unggulan */}
      <section id="fitur" className="max-w-7xl mx-auto px-8 py-16">
        <h4 className="text-blue-600 font-bold text-sm mb-8 uppercase">
          Fitur Unggulan
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center mb-6">
              <Cpu className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0A2647] mb-3">
              AI Kategori
            </h3>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              AI membantu mengkategorikan laporan anda secara otomatis agar
              lebih cepat ditangani.
            </p>
            <Link
              href="#"
              className="text-blue-600 font-semibold text-sm flex items-center gap-2 hover:text-blue-800"
            >
              Pelajari lebih lanjut &rarr;
            </Link>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6">
              <CheckSquare className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0A2647] mb-3">
              Tracking Status
            </h3>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Pantau perkembangan laporan anda secara real-time hingga laporan
              selesai ditindaklanjuti.
            </p>
            <Link
              href="#"
              className="text-blue-600 font-semibold text-sm flex items-center gap-2 hover:text-blue-800"
            >
              Pelajari lebih lanjut &rarr;
            </Link>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-amber-400 text-white rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0A2647] mb-3">
              Maps Lokasi
            </h3>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Laporkan dengan lokasi akurat menggunakan peta untuk penanganan
              yang lebih tepat sasaran.
            </p>
            <Link
              href="#"
              className="text-blue-600 font-semibold text-sm flex items-center gap-2 hover:text-blue-800"
            >
              Pelajari lebih lanjut &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section id="cara-kerja" className="max-w-7xl mx-auto px-8 py-16 mb-16">
        <h4 className="text-blue-600 font-bold text-sm mb-2 uppercase">
          Cara Kerja
        </h4>
        <h2 className="text-3xl font-bold text-[#0A2647] mb-12">
          Laporkan dalam 4 Langkah Mudah
        </h2>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center w-40 shrink-0 z-10 bg-slate-50">
            <div className="w-16 h-16 bg-white border border-slate-200 text-[#0A2647] rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <FileEdit className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#0A2647] text-sm">
              <span className="bg-[#0A2647] text-white px-1.5 py-0.5 rounded text-xs mr-2">
                1
              </span>
              Buat Laporan
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Isi detail laporan,
              <br />
              pilih kategori
              <br />
              masalah.
            </p>
          </div>
          <div className="hidden md:block flex-1 border-t border-dashed border-slate-300 -mt-16 mx-2" />

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center w-40 shrink-0 z-10 bg-slate-50">
            <div className="w-16 h-16 bg-white border border-slate-200 text-[#0A2647] rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <CloudUpload className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#0A2647] text-sm">
              <span className="bg-[#0A2647] text-white px-1.5 py-0.5 rounded text-xs mr-2">
                2
              </span>
              Verifikasi
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Laporan Anda
              <br />
              diverifikasi
              <br />
              oleh sistem.
            </p>
          </div>
          <div className="hidden md:block flex-1 border-t border-dashed border-slate-300 -mt-16 mx-2" />

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center w-40 shrink-0 z-10 bg-slate-50">
            <div className="w-16 h-16 bg-white border border-slate-200 text-[#0A2647] rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#0A2647] text-sm">
              <span className="bg-[#0A2647] text-white px-1.5 py-0.5 rounded text-xs mr-2">
                3
              </span>
              Diproses
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Laporan diteruskan
              <br />
              ke instansi
              <br />
              terkait.
            </p>
          </div>
          <div className="hidden md:block flex-1 border-t border-dashed border-slate-300 -mt-16 mx-2" />

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center w-40 shrink-0 z-10 bg-slate-50">
            <div className="w-16 h-16 bg-white border border-slate-200 text-[#0A2647] rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#0A2647] text-sm">
              <span className="bg-[#0A2647] text-white px-1.5 py-0.5 rounded text-xs mr-2">
                4
              </span>
              Selesai
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Laporan ditindaklanjuti
              <br />
              dan Anda
              <br />
              diberi tahu.
            </p>
          </div>
        </div>
      </section>

      {/* Data Laporan */}
      <section className="bg-[#1C4E8A] py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <h4 className="text-blue-200 font-bold text-xs mb-1 uppercase tracking-wider">
            Data Laporan
          </h4>
          <h2 className="text-2xl font-bold text-white mb-8">
            Bersama Warga, Wujudkan Perubahan
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="bg-[#4285F4] rounded-lg p-4 flex items-center gap-4 text-white">
              <div className="bg-white/20 p-3 rounded-md">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">1.200</h3>
                <p className="text-xs text-blue-100">Total Laporan</p>
              </div>
            </div>
            {/* Stat 2 */}
            <div className="bg-[#0F9D58] rounded-lg p-4 flex items-center gap-4 text-white">
              <div className="bg-white/20 p-3 rounded-md">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">2.945</h3>
                <p className="text-xs text-green-100">
                  Selesai Ditindaklanjuti
                </p>
              </div>
            </div>
            {/* Stat 3 */}
            <div className="bg-[#E37400] rounded-lg p-4 flex items-center gap-4 text-white">
              <div className="bg-white/20 p-3 rounded-md">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">1.245</h3>
                <p className="text-xs text-orange-100">Dalam Proses</p>
              </div>
            </div>
            {/* Stat 4 */}
            <div className="bg-[#D93025] rounded-lg p-4 flex items-center gap-4 text-white">
              <div className="bg-white/20 p-3 rounded-md">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">8.761</h3>
                <p className="text-xs text-red-100">Warga Terdaftar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
