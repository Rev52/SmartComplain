"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  MessageSquareText, 
  UserCheck, 
  Sparkles, 
  User, 
  Mail, 
  Phone,
  Lock, 
  ShieldCheck,
  Eye, 
  EyeOff
} from "lucide-react";
import { registerUser } from "@/utils/authStorage";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Kata sandi dan ulangi sandi tidak cocok!");
      return;
    }

    const res = registerUser(formData);
    if (res.success) {
      router.push('/login');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      
      {/* 🔹 Kiri - Panel Informasi (Background Terang) */}
      <div className="w-full md:w-1/2 bg-[#F8FAFC] p-10 lg:p-20 flex flex-col justify-between min-h-screen">
        
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-16">
            <div className="flex flex-col">
              <Image src="/LOGO2.png" alt="SmartComplain" width={240} height={80} className="h-16 w-auto object-contain" priority />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-[42px] font-bold leading-[1.2] mb-16 max-w-md pr-8 text-[#0A2647]">
            Platform Pengaduan Fasilitas Publik Modern Warga Surabaya
          </h1>

          {/* Fitur List */}
          <div className="space-y-8">
            {/* Fitur 1 */}
            <div className="flex items-center gap-5">
              <div className="w-[72px] h-[72px] bg-[#4B6B8A] rounded-2xl flex items-center justify-center shrink-0">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold text-[#0A2647] mb-1">Mudah Digunakan</h3>
                <p className="text-sm text-slate-600 leading-snug">
                  Laporkan keluhan hanya dalam<br />beberapa langkah sederhana.
                </p>
              </div>
            </div>

            {/* Fitur 2 */}
            <div className="flex items-center gap-5">
              <div className="w-[72px] h-[72px] bg-[#4B6B8A] rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold text-[#0A2647] mb-1">Transparan</h3>
                <p className="text-sm text-slate-600 leading-snug">
                  Setiap laporan ditindaklanjuti secara<br />terbuka dan dapat dipantau warga.
                </p>
              </div>
            </div>

            {/* Fitur 3 */}
            <div className="flex items-center gap-5">
              <div className="w-[72px] h-[72px] bg-[#4B6B8A] rounded-2xl flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold text-[#0A2647] mb-1">Untuk Surabaya</h3>
                <p className="text-sm text-slate-600 leading-snug">
                  Bersama membangun Surabaya<br />yang lebih baik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Kanan - Form Register dengan Background */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center p-6 lg:p-10 min-h-screen">
        
        {/* Background Image Area */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/background register.png" 
            alt="Background Surabaya" 
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Card Form Register */}
        <div className="bg-[#0A2647] rounded-3xl p-8 lg:p-10 w-full max-w-[500px] z-10 shadow-2xl relative mt-10 md:mt-0">
          <h2 className="text-[28px] font-bold text-white mb-2 text-center md:text-left">Buat Akun Baru</h2>
          <p className="text-sm text-gray-300 mb-6 text-center md:text-left">
            Lengkapi data dibawah ini untuk<br className="hidden md:block" />memulai !
          </p>
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm mb-6 font-medium">
              {errorMsg}
            </div>
          )}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5" onSubmit={handleRegister}>
            
            {/* Input Nama Lengkap (Full Width) */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-[15px] font-semibold text-gray-300 block">Nama Lengkap</label>
              <input 
                type="text" 
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama"
                className="w-full px-6 py-3.5 rounded-full bg-[#F3F4F6] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"
                required
              />
            </div>

            {/* Input Email (Half Width) */}
            <div className="space-y-2 col-span-1">
              <label className="text-[15px] font-semibold text-gray-300 block">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-800" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[#F3F4F6] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Input No Telepon (Half Width) */}
            <div className="space-y-2 col-span-1">
              <label className="text-[15px] font-semibold text-gray-300 block">No. Telepon</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-800" />
                </div>
                <input 
                  type="tel" 
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  placeholder="Masukkan No. Telp"
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[#F3F4F6] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Input Kata Sandi (Half Width) */}
            <div className="space-y-2 col-span-1">
              <label className="text-[15px] font-semibold text-gray-300 block">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-800" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  className="w-full pl-11 pr-10 py-3.5 rounded-full bg-[#F3F4F6] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal tracking-widest"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            {/* Input Ulangi Sandi (Half Width) */}
            <div className="space-y-2 col-span-1">
              <label className="text-[15px] font-semibold text-gray-300 block">Ulangi Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-800" />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••"
                  className="w-full pl-11 pr-10 py-3.5 rounded-full bg-[#F3F4F6] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal tracking-widest"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            {/* Tombol Daftar */}
            <div className="col-span-1 md:col-span-2 pt-6 flex justify-center">
              <button 
                type="submit"
                className="w-3/4 max-w-[240px] bg-white text-[#0A2647] font-bold text-base py-3.5 rounded-full shadow-sm transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Daftar Sekarang
              </button>
            </div>
          </form>

          {/* Link Login */}
          <div className="mt-8 text-center text-sm text-gray-300">
            Sudah Memiliki Akun? <Link href="/login" className="text-white font-bold hover:underline">Login disini</Link>
          </div>
          
        </div>
      </div>

    </div>
  );
}