"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";
import { useLanguage } from "@/utils/languageStorage";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
};

export default function Topbar() {
  const router = useRouter();
  const { t } = useLanguage();

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, phone, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Gagal mengambil profile:", error.message);
        return;
      }

      setProfile({
        full_name: data?.full_name || "Pengguna",
        email: data?.email || user.email || "",
        phone: data?.phone || "",
        avatar_url: data?.avatar_url || null,
      });
    };

    fetchProfile();
  }, [router]);

  const getFirstName = (name: string | null | undefined) => {
    if (!name) return "Pengguna";

    const parts = name.trim().split(" ");
    return parts.length > 1 ? `${parts[0]} ${parts[1]}` : parts[0];
  };

  const displayName = profile?.full_name || "Pengguna";

  return (
    <header className="flex flex-col md:flex-row md:justify-between md:items-end pt-4 md:pt-8 pb-6 px-4 md:px-8 relative z-50 gap-4">
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-[#0A2647] mb-1">
          {t.topbar.welcome.replace("{name}", displayName)}
        </h1>

        <p className="text-slate-600 text-xs md:text-sm">
          {t.topbar.summary}
        </p>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto mt-2 md:mt-0">
        <Link
          href="/notifikasi"
          className="relative text-[#0A2647] hover:text-blue-600 transition-colors"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-slate-50 rounded-full" />
        </Link>

        <Link
          href="/profil"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-slate-300 rounded-full overflow-hidden border border-slate-200">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-300" />
            )}
          </div>

          <div className="flex items-center gap-1 font-medium text-[#0A2647] text-sm group-hover:text-blue-600 transition-colors">
            {getFirstName(profile?.full_name)}
            <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
          </div>
        </Link>
      </div>
    </header>
  );
}