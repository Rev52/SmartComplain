"use client"

import { useState, useEffect } from "react";
import { Lock, CheckCircle2, X } from "lucide-react";
import Image from "next/image";
import { getUserProfile, saveUserProfile } from "@/utils/userStorage";
import { useLanguage } from "@/utils/languageStorage";
import { updateCurrentUserProfile } from "@/utils/authStorage";

export default function ProfilSayaPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    alamat: ""
  });
  
  const [fotoProfil, setFotoProfil] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const user = getUserProfile();
    setFormData({
      nama: user.nama,
      email: user.email,
      telepon: user.telepon,
      alamat: user.alamat
    });
    setFotoProfil(user.foto);
  }, []);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setFotoProfil(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile({
      ...formData,
      foto: fotoProfil
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    const user = getUserProfile();
    if (user.password && user.password !== passwordForm.oldPassword) {
      setPasswordError("Password lama tidak sesuai!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter!");
      return;
    }

    updateCurrentUserProfile({ password: passwordForm.newPassword });
    setPasswordSuccess(true);
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setPasswordSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl relative z-10 -mt-2 pb-10">
      
      {/* 🔹 Header Halaman */}
      <div className="mt-4 mb-6">
        <h1 className="text-[32px] font-bold text-[#0A2647] mb-2">{t.profil.title}</h1>
        <p className="text-slate-600 text-[15px]">{t.profil.desc}</p>
      </div>

      {/* 🔹 Grid Utama (Kiri: Avatar, Kanan: Form) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* Kolom Kiri: Card Avatar */}
        <div className="col-span-1 bg-white/95 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col items-center text-center">
          <label htmlFor="upload-profil" className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 bg-slate-200 border-4 border-white shadow-md relative cursor-pointer group flex items-center justify-center">
            {fotoProfil ? (
              <img src={fotoProfil} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-400 text-sm">{t.profil.fotoProfil}</span>
            )}
            
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">{t.profil.ubahFoto}</span>
            </div>

            <input 
              id="upload-profil" 
              type="file" 
              accept="image/png, image/jpeg" 
              className="hidden" 
              onChange={handleFotoChange}
            />
          </label>
          
          <h2 className="text-xl font-bold text-[#0A2647] mb-2">{formData.nama || "Nama Pengguna"}</h2>
          <p className="text-sm text-slate-500 font-medium mb-1.5">{formData.email}</p>
          <p className="text-sm text-slate-500 font-medium">{formData.telepon}</p>
        </div>

        {/* Kolom Kanan: Card Form Informasi Pribadi */}
        <div className="col-span-1 md:col-span-2 bg-white/95 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-[#0A2647] mb-6">{t.profil.infoPribadi}</h3>
          
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            
            {/* Input Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#0A2647]">{t.profil.nama}</label>
              <input 
                type="text" 
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>

            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#0A2647]">{t.profil.email}</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>

            {/* Input No Telepon */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#0A2647]">{t.profil.telepon}</label>
              <input 
                type="tel" 
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>

            {/* Input Alamat */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#0A2647]">{t.profil.alamat}</label>
              <input 
                type="text" 
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>

            {/* Tombol Simpan */}
            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="bg-[#124B8F] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0A2647] transition-colors shadow-sm"
              >
                {t.profil.simpan}
              </button>
            </div>
            
          </form>
        </div>
      </div>

      {/* 🔹 Baris Bawah: Card Ubah Password */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-[#124B8F]" />
          </div>
          <div>
            <h4 className="font-bold text-[#0A2647] text-[15px] mb-0.5">{t.profil.ubahPasswordTitle}</h4>
            <p className="text-xs text-slate-500 font-medium">
              {t.profil.ubahPasswordDesc}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowPasswordModal(true)}
          className="w-full md:w-auto bg-white border border-[#124B8F] text-[#124B8F] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm shrink-0 mt-2 md:mt-0"
        >
          {t.profil.btnUbahPassword}
        </button>

      </div>

      {/* 🔹 Toast Notification */}
      <div 
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-center gap-3 bg-[#124B8F] text-white px-5 py-4 rounded-xl shadow-lg border border-blue-800 transition-all duration-300 transform ${
          showToast ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        <CheckCircle2 className="w-6 h-6 text-green-400" />
        <div>
          <h4 className="font-bold text-sm">Berhasil!</h4>
          <p className="text-xs text-blue-100 font-medium mt-0.5">{t.profil.alertSukses}</p>
        </div>
      </div>

      {/* 🔹 Modal Ubah Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 transition-all">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0A2647]">{t.profil.ubahPasswordTitle}</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {passwordError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 font-medium border border-red-100">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm mb-4 font-medium border border-green-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Password berhasil diubah!
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#0A2647]">Password Lama</label>
                <input 
                  type="password" 
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#0A2647]">Password Baru</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#124B8F] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0A2647] transition-colors"
                >
                  Simpan Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}