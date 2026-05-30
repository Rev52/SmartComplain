"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  MapPin,
  CloudUpload,
  ChevronDown,
  X,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/utils/languageStorage";
import { createClient } from "@/lib/supabase/client";

export default function BuatLaporanPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [deskripsi, setDeskripsi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [showToast, setShowToast] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [kategori, setKategori] = useState("");

  const [loading, setLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const kategoriOptions = [
    "Jalan & Infrastruktur",
    "Kebersihan",
    "Penerangan Jalan",
    "Fasilitas Umum",
    "Saluran Air",
    "Keamanan & Ketertiban",
    "Lainnya",
  ];

  const isValidCoordinate = (lat: number | null, lng: number | null) => {
    return (
      lat !== null &&
      lng !== null &&
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    );
  };

  const geocodeAddress = async (alamat: string) => {
    const query = `${alamat}, Surabaya, Indonesia`;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1&accept-language=id`
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    return {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
    };
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`
    );

    const data = await response.json();

    return data?.display_name || `${lat}, ${lng}`;
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung fitur lokasi.");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;

        setLatitude(currentLat);
        setLongitude(currentLng);

        try {
          const address = await reverseGeocode(currentLat, currentLng);
          setLokasi(address);
        } catch (error) {
          console.error("Gagal mengubah koordinat ke alamat:", error);
          setLokasi(`${currentLat}, ${currentLng}`);
        } finally {
          setIsGettingLocation(false);
        }
      },
      () => {
        alert("Gagal mengambil lokasi. Izinkan akses lokasi di browser.");
        setIsGettingLocation(false);
      }
    );
  };

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

    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      let finalLat = latitude;
      let finalLng = longitude;

      if (!isValidCoordinate(finalLat, finalLng)) {
        const geo = await geocodeAddress(lokasi);

        if (geo) {
          finalLat = geo.lat;
          finalLng = geo.lng;

          setLatitude(geo.lat);
          setLongitude(geo.lng);
        }
      }

      if (!isValidCoordinate(finalLat, finalLng)) {
        alert(
          "Alamat tidak berhasil ditemukan di peta. Coba isi alamat lebih lengkap atau gunakan tombol Lokasi Saat Ini."
        );
        setLoading(false);
        return;
      }

      const base64Images = await Promise.all(
        fotos.map((foto) => fileToBase64(foto))
      );

      const title = `${kategori} di ${
        lokasi.split(",")[0] || "Lokasi tidak diketahui"
      }`;

      const { error } = await supabase.from("laporan").insert({
        user_id: user.id,
        judul: title,
        kategori,
        lokasi,
        deskripsi,
        status: "menunggu",
        prioritas: "sedang",
        foto_url: base64Images,
        lat: finalLat,
        lng: finalLng,
        latitude: finalLat,
        longitude: finalLng,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Gagal membuat laporan:", error.message);
        alert("Gagal membuat laporan: " + error.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        router.push("/laporan");
      }, 2000);
    } catch (error) {
      console.error("Error submit laporan:", error);
      alert("Terjadi kesalahan saat mengirim laporan.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl relative z-10 -mt-2">
      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-[#0A2647] mb-2">
          {t.buat.title}
        </h1>
        <p className="text-slate-600 text-sm">{t.buat.desc}</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2 relative">
          <label className="text-[15px] font-bold text-[#0A2647] block">
            {t.buat.kategori}
          </label>

          <div className="relative">
            {isDropdownOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
            )}

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
                <ChevronDown
                  className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

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
                        ? "bg-[#E3EFFF] text-[#3B82F6]"
                        : "text-[#0A2647] hover:bg-slate-200"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
              onChange={(e) => {
                setLokasi(e.target.value);
                setLatitude(null);
                setLongitude(null);
              }}
              placeholder={t.buat.placeholderLokasi}
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 border-none"
            />
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isGettingLocation}
            className="mt-3 inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-600 px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <MapPin className="w-4 h-4" />
            {isGettingLocation ? "Mengambil lokasi..." : t.buat.btnLokasi}
          </button>

          {isValidCoordinate(latitude, longitude) && (
            <p className="text-xs text-green-600 font-medium mt-2">
              Koordinat ditemukan: {latitude?.toFixed(6)},{" "}
              {longitude?.toFixed(6)}
            </p>
          )}
        </div>

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
          />

          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-slate-500 font-medium">
              {t.buat.minChar}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {deskripsi.length}/500
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[15px] font-bold text-[#0A2647] flex items-baseline gap-2">
            {t.buat.foto}
            <span className="text-xs text-slate-500 font-medium">
              {t.buat.maksFoto}
            </span>
          </label>

          <div className="flex flex-wrap gap-4">
            {fotos.map((foto, index) => (
              <div
                key={index}
                className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm group"
              >
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
                <div
                  className={`${
                    fotos.length > 0 ? "w-8 h-8 mb-1" : "w-12 h-12 mb-3"
                  } bg-blue-50 text-[#124B8F] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <CloudUpload
                    className={fotos.length > 0 ? "w-4 h-4" : "w-6 h-6"}
                  />
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
                  <span className="text-[10px] font-bold text-slate-500">
                    {t.buat.tambah}
                  </span>
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

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/laporan")}
            className="w-full sm:w-32 py-3.5 bg-white text-[#0A2647] font-bold text-sm rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
          >
            {t.buat.batal}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:flex-1 py-3.5 bg-[#124B8F] text-white font-bold text-sm rounded-xl shadow-sm hover:bg-[#0A2647] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Mengirim..." : t.buat.kirim}
          </button>
        </div>
      </form>

      <div
        className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#124B8F] text-white px-5 py-4 rounded-xl shadow-lg border border-blue-800 transition-all duration-300 transform ${
          showToast
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        <CheckCircle2 className="w-6 h-6 text-green-400" />
        <div>
          <h4 className="font-bold text-sm">Berhasil!</h4>
          <p className="text-xs text-blue-100 font-medium mt-0.5">
            {t.buat.alertSukses}
          </p>
        </div>
      </div>
    </div>
  );
}
