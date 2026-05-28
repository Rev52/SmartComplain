"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  UserCheck, 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff
} from "lucide-react";
import { loginUser } from "@/utils/authStorage";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    const res = loginUser(email, password);
    if (res.success) {
      router.push('/beranda');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      
      {/* 🔹 Kiri - Panel Biru (Informasi) */}
      <div className="w-full md:w-1/2 bg-[#0A2647] text-white p-10 lg:p-20 flex flex-col justify-between min-h-screen">
        
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-16">
            <div className="flex flex-col">
              <Image src="/LOGO.png" alt="SmartComplain" width={240} height={80} className="h-16 w-auto object-contain" priority />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-[42px] font-bold leading-[1.2] mb-16 max-w-md pr-8">
            Platform Pengaduan Fasilitas Publik Modern Warga Surabaya
          </h1>

          {/* Fitur List */}
          <div className="space-y-8">
            {/* Fitur 1 */}
            <div className="flex items-center gap-5">
              <div className="w-[72px] h-[72px] bg-[#8BA3C0]/20 rounded-2xl flex items-center justify-center shrink-0">
                <UserCheck className="w-8 h-8 text-[#B0CBE8]" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-1">Mudah Digunakan</h3>
                <p className="text-sm text-gray-300 leading-snug">
                  Laporkan keluhan hanya dalam<br />beberapa langkah sederhana.
                </p>
              </div>
            </div>

            {/* Fitur 2 */}
            <div className="flex items-center gap-5">
              <div className="w-[72px] h-[72px] bg-[#8BA3C0]/20 rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles className="w-8 h-8 text-[#B0CBE8]" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-1">Transparan</h3>
                <p className="text-sm text-gray-300 leading-snug">
                  Setiap laporan ditindaklanjuti secara<br />terbuka dan dapat dipantau warga.
                </p>
              </div>
            </div>

            {/* Fitur 3 */}
            <div className="flex items-center gap-5">
              <div className="w-[72px] h-[72px] bg-[#8BA3C0]/20 rounded-2xl flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-[#B0CBE8]" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-1">Untuk Surabaya</h3>
                <p className="text-sm text-gray-300 leading-snug">
                  Bersama membangun Surabaya<br />yang lebih baik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Kanan - Form Login dengan Background */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center p-6 lg:p-10 min-h-screen">
        
        {/* Background Image Area */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/background login.png" 
            alt="Background Surabaya" 
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Card Form Login */}
        <div className="bg-[#0A2647] rounded-3xl p-10 w-full max-w-[420px] z-10 shadow-2xl relative mt-10 md:mt-0">
          <h2 className="text-3xl font-bold text-white mb-2 text-center md:text-left">Selamat Datang!</h2>
          <p className="text-sm text-gray-300 mb-6 text-center md:text-left">
            Login untuk melanjutkan akses ke<br className="hidden md:block" />SmartComplain
          </p>
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm mb-6 font-medium">
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-[15px] font-semibold text-gray-300 block">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-800" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  className="w-full pl-12 pr-4 py-3.5 rounded-full bg-[#F3F4F6] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"
                  required
                />
              </div>
            </div>

            {/* Input Kata Sandi */}
            <div className="space-y-2">
              <label className="text-[15px] font-semibold text-gray-300 block">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-800" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-full bg-[#F3F4F6] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal tracking-widest"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Tombol Login */}
            <div className="pt-6 flex justify-center">
              <button 
                type="submit"
                className="w-3/4 max-w-[240px] bg-white text-[#0A2647] font-bold text-base py-3.5 rounded-full shadow-sm transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Login
              </button>
            </div>
          </form>

          {/* Link Daftar */}
          <div className="mt-8 text-center text-sm text-gray-300">
            Belum Memiliki Akun? <Link href="/register" className="text-white font-bold hover:underline">Daftar disini</Link>
          </div>
          
        </div>
      </div>

    </div>
  );
}