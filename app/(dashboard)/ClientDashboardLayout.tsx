"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/component/layout/Sidebar";
import ConditionalTopbar from "@/component/layout/ConditionalTopbar";
import DynamicBackground from "@/component/layout/DynamicBackground";
import MobileHeader from "@/component/layout/MobileHeader";
import { getCurrentUser } from "@/utils/authStorage";

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return null; // prevent rendering dashboard briefly before redirect
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Sidebar with mobile drawer functionality */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Area Konten Utama dengan Background */}
      <main className="flex-1 relative w-full flex flex-col min-w-0">
        <DynamicBackground />

        {/* Mobile Header (Hidden on md and above) */}
        <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Konten Aktif */}
        <div className="relative z-20 w-full h-full flex flex-col">
          <ConditionalTopbar />
          <div className="px-4 md:px-8 py-6 md:pb-10 flex-1 overflow-x-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
