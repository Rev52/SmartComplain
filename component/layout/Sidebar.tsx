"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  Home, 
  FileText, 
  Edit3, 
  Bell, 
  User, 
  Settings, 
  HelpCircle,
  LogOut,
  AlertTriangle
} from "lucide-react";
import { useLanguage } from "@/utils/languageStorage";
import { logoutUser } from "@/utils/authStorage";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  
  // State untuk mengontrol pop-up
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Fungsi untuk menangani aksi logout
  const handleLogout = () => {
    logoutUser();
    setIsLogoutModalOpen(false);
    // Arahkan kembali ke Landing Page
    router.push("/");
  };

  const navItems = [
    { name: t.sidebar.beranda, href: "/beranda", icon: Home },
    { name: t.sidebar.laporan, href: "/laporan", icon: FileText },
    { name: t.sidebar.buat, href: "/buat", icon: Edit3 },
    { name: "Notifikasi", href: "/notifikasi", icon: Bell },
    { name: t.sidebar.profil, href: "/profil", icon: User },
    { name: t.sidebar.pengaturan, href: "/pengaturan", icon: Settings },
    { name: t.sidebar.faq, href: "/bantuan", icon: HelpCircle },
  ];

  return (
    <>
      {/* 🔹 Overlay untuk Mobile ketika Sidebar Terbuka */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:sticky md:top-0 md:translate-x-0 transition-transform duration-300 ease-in-out w-[260px] shrink-0 bg-[#0A2647] text-white flex flex-col h-screen z-50`}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 mb-4">
          <div className="flex flex-col">
            <Image src="/LOGO.png" alt="SmartComplain" width={120} height={40} className="h-16 w-auto object-contain" priority />
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 px-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = decodeURIComponent(pathname) === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? "bg-[#1C4E8A] text-white" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" /> {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Keluar */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 w-full rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" /> {t.sidebar.keluar}
          </button>
        </div>
      </aside>

      {/* 🔹 Overlay Pop Up Logout */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 transition-all">
          
          {/* Box Pop Up (Sesuai Desain 100%) */}
          <div className="bg-[#052C5C] w-full max-w-[420px] rounded border border-[#0A3D7A] p-8 shadow-2xl flex flex-col items-center text-center transform scale-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header: Ikon & Judul */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="w-[28px] h-[28px] text-[#FFC107] fill-[#FFC107]" />
              <h2 className="text-[22px] font-bold text-white tracking-wide">Konfirmasi Logout</h2>
            </div>
            
            {/* Subtitle */}
            <p className="text-white text-base mb-8 font-medium">
              Apakah kamu yakin ingin<br />keluar dari akun?
            </p>

            {/* Tombol Aksi */}
            <div className="flex gap-6 w-full px-2">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 bg-[#2263A9] hover:bg-[#1C528C] text-white py-2.5 rounded-lg font-semibold text-lg transition-colors shadow-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 bg-[#2263A9] hover:bg-[#1C528C] text-white py-2.5 rounded-lg font-semibold text-lg transition-colors shadow-sm"
              >
                Keluar
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}