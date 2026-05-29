"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Map,
  BarChart3,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types/user";

interface AdminSidebarProps {
  profile: Profile | null;
}

export default function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    setIsLogoutModalOpen(false);
    setIsLoggingOut(false);

    router.replace("/login");
    router.refresh();
  };

  const navItems = [
    {
      name: "Beranda",
      href: "/admin/beranda",
      icon: LayoutDashboard,
    },
    {
      name: "Laporan",
      href: "/admin/laporan",
      icon: FileText,
    },
    {
      name: "Maps",
      href: "/admin/maps",
      icon: Map,
    },
    {
      name: "Statistik",
      href: "/admin/statistik",
      icon: BarChart3,
    },
  ];

  return (
    <>
      <aside className="fixed inset-y-0 left-0 w-[260px] shrink-0 bg-[#0A2647] text-white flex flex-col h-screen z-50">
        {/* Logo */}
        <div className="p-6 flex items-center justify-center mb-4">
          <Image
            src="/LOGO.png"
            alt="SmartComplain"
            width={160}
            height={60}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 px-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 w-full rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Modal Logout */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 transition-all">
          <div className="bg-[#052C5C] w-full max-w-[420px] rounded border border-[#0A3D7A] p-8 shadow-2xl flex flex-col items-center text-center transform scale-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="w-[28px] h-[28px] text-[#FFC107] fill-[#FFC107]" />
              <h2 className="text-[22px] font-bold text-white tracking-wide">
                Konfirmasi Logout
              </h2>
            </div>

            <p className="text-white text-base mb-8 font-medium">
              Apakah kamu yakin ingin
              <br />
              keluar dari akun?
            </p>

            <div className="flex gap-6 w-full px-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                disabled={isLoggingOut}
                className="flex-1 bg-[#2263A9] hover:bg-[#1C528C] text-white py-2.5 rounded-lg font-semibold text-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 bg-[#2263A9] hover:bg-[#1C528C] text-white py-2.5 rounded-lg font-semibold text-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "Keluar..." : "Keluar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
