"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  MapPin, 
  CloudUpload, 
  ChevronDown,
  X,
  CheckCircle2
} from "lucide-react";
import { addLaporan } from "@/utils/laporanStorage";
import { useLanguage } from "@/utils/languageStorage";

export default function BuatLaporanPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [deskripsi, setDeskripsi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [showToast, setShowToast] = useState(false);
  
  // State untuk custom dropdown kategori
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [kategori, setKategori] = useState("");

  // Daftar opsi kategori sesuai gambar
  const kategoriOptions = [
    "Jalan & Infrastruktur",
    "Kebersihan",
    "Penerangan Jalan",
    "Fasilitas Umum",
    "Saluran Air",
    "Keamanan & Ketertiban",
    "Lainnya"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (fotos.length + newFiles.length > 5) {
        alert(t.buat.alertMaks);
        return;
      }
      setFotos([...fotos, ...newFiles]);
    }
  };

  const removeFoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kategori || !lokasi || deskripsi.length < 10) {
      alert(t.buat.alertLengkap);
      return;
    }

    // Convert all selected photos to base64
    const base64Images = await Promise.all(fotos.map(f => fileToBase64(f)));

    // Generate title automatically
    const title = `${kategori} di ${lokasi.split(',')[0] || 'Lokasi tidak diketahui'}`;

    addLaporan({
      title,
      category: kategori,
      address: lokasi,
      description: deskripsi,
      images: base64Images
    });

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push("/laporan");
    }, 2000); // 2 detik delay untuk melihat notifikasi
  };

  return (
    <div className="max-w-4xl relative z-10 -mt-2"> {/* Margin negatif untuk kompensasi Topbar jika diperlukan */}
      
      {/* 🔹 Header Halaman */}
      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-[#0A2647] mb-2">{t.buat.title}</h1>
        <p className="text-slate-600 text-sm">{t.buat.desc}</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* 🔹 Input Kategori Laporan (Custom Dropdown) */}
        <div className="space-y-2 relative">
          <label className="text-[15px] font-bold text-[#0A2647] block">
            {t.buat.kategori}
          </label>
          
          <div className="relative">
            {/* Overlay transparan untuk menutup dropdown saat area luar diklik */}
            {isDropdownOpen && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              ></div>
            )}

            {/* Trigger Dropdown */}
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full pl-11 pr-10 py-3.5 bg-white rounded-xl text-sm font-medium shadow-sm cursor-pointer relative z-50 flex items-center border border-transparent hover:border-slate-200 transition-colors"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              
              <span className={kategori ? "text-slate-800" : "text-slate-500"}>
                {kategori || t.buat.pilihKategori}
              </span>
              
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </div>
            </div>

            {/* Menu Dropdown */}
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-[#F8FAFC] border border-slate-200 rounded-xl shadow-lg py-2 flex flex-col gap-1 max-h-80 overflow-y-auto">
                {kategoriOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setKategori(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-5 py-3.5 mx-2 rounded-lg cursor-pointer text-sm font-bold transition-colors ${
                      kategori === option
                        ? "bg-[#E3EFFF] text-[#3B82F6]" // Background biru muda, text biru
                        : "text-[#0A2647] hover:bg-slate-200" // Text navy, hover abu-abu
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Input Lokasi Kejadian */}
        <div className="space-y-2">
          <label className="text-[15px] font-bold text-[#0A2647] block">
            {t.buat.lokasi}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-500" />
            </div>
            <input 
              type="text" 
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder={t.buat.placeholderLokasi}
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border-none"
            />
          </div>
          {/* Tombol Gunakan Lokasi Saat Ini */}
          <button 
            type="button"
            onClick={() => setLokasi("Jl. Panglima Sudirman No. 45, Surabaya")}
            className="mt-3 inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-600 px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors shadow-sm"
          >
            <MapPin className="w-4 h-4" /> {t.buat.btnLokasi}
          </button>
        </div>

        {/* 🔹 Input Deskripsi Laporan */}
        <div className="space-y-2">
          <label className="text-[15px] font-bold text-[#0A2647] block">
            {t.buat.deskripsi}
          </label>
          <textarea 
            placeholder={t.buat.placeholderDesc}
            className="w-full p-4 bg-white rounded-xl text-sm text-slate-800 placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border-none min-h-[140px] resize-none"
            maxLength={500}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          ></textarea>
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-slate-500 font-medium">{t.buat.minChar}</span>
            <span className="text-xs text-slate-500 font-medium">{deskripsi.length}/500</span>
          </div>
        </div>

        {/* 🔹 Input Foto Bukti */}
        <div className="space-y-2">
          <label className="text-[15px] font-bold text-[#0A2647] flex items-baseline gap-2">
            {t.buat.foto} <span className="text-xs text-slate-500 font-medium">{t.buat.maksFoto}</span>
          </label>
          
          <div className="flex flex-wrap gap-4">
            {fotos.map((foto, index) => (
              <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                <img 
                  src={URL.createObjectURL(foto)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <div 
                  onClick={() => removeFoto(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}

            {fotos.length < 5 && (
              <label 
                htmlFor="upload-foto" 
                className={`flex flex-col items-center justify-center cursor-pointer transition-colors group ${
                  fotos.length > 0 
                    ? "w-24 h-24 bg-white/80 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl"
                    : "w-full bg-white/80 backdrop-blur-sm border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl py-12"
                }`}
              >
                <div className={`${fotos.length > 0 ? 'w-8 h-8 mb-1' : 'w-12 h-12 mb-3'} bg-blue-50 text-[#124B8F] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <CloudUpload className={`${fotos.length > 0 ? 'w-4 h-4' : 'w-6 h-6'}`} />
                </div>
                {fotos.length === 0 ? (
                  <>
                    <p className="text-sm font-bold text-[#0A2647] text-center leading-snug mb-2 whitespace-pre-line">
                      {t.buat.uploadBox}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {t.buat.format}
                    </p>
                  </>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500">{t.buat.tambah}</span>
                )}
                <input 
                  id="upload-foto" 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* 🔹 Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4">
          <button 
            type="button"
            className="w-full sm:w-32 py-3.5 bg-white text-[#0A2647] font-bold text-sm rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
          >
            {t.buat.batal}
          </button>
          <button 
            type="submit"
            className="w-full sm:flex-1 py-3.5 bg-[#124B8F] text-white font-bold text-sm rounded-xl shadow-sm hover:bg-[#0A2647] transition-colors"
          >
            {t.buat.kirim}
          </button>
        </div>

      </form>

      {/* 🔹 Toast Notification */}
      <div 
        className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#124B8F] text-white px-5 py-4 rounded-xl shadow-lg border border-blue-800 transition-all duration-300 transform ${
          showToast ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        <CheckCircle2 className="w-6 h-6 text-green-400" />
        <div>
          <h4 className="font-bold text-sm">Berhasil!</h4>
          <p className="text-xs text-blue-100 font-medium mt-0.5">{t.buat.alertSukses}</p>
        </div>
      </div>

    </div>
  );
}