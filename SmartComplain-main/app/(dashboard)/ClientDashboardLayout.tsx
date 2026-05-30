"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/component/layout/Sidebar";
import ConditionalTopbar from "@/component/layout/ConditionalTopbar";
import DynamicBackground from "@/component/layout/DynamicBackground";
import MobileHeader from "@/component/layout/MobileHeader";
import { createClient } from "@/lib/supabase/client";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role === "admin") {
        router.replace("/admin/beranda");
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 relative w-full flex flex-col min-w-0">
        <DynamicBackground />

        <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

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
