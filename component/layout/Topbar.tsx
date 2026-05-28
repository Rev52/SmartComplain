"use client"

import { useState, useEffect } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { getUserProfile, UserProfile } from "@/utils/userStorage";
import { useLanguage } from "@/utils/languageStorage";

export default function Topbar() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const loadProfile = () => {
      setProfile(getUserProfile());
    };

    loadProfile();
    window.addEventListener("userProfileUpdated", loadProfile);
    
    return () => {
      window.removeEventListener("userProfileUpdated", loadProfile);
    };
  }, []);

  const getFirstName = (name: string) => {
    if (!name) return "Pengguna";
    const parts = name.split(" ");
    return parts.length > 1 ? `${parts[0]} ${parts[1]}` : parts[0];
  };

  return (
    <header className="flex flex-col md:flex-row md:justify-between md:items-end pt-4 md:pt-8 pb-6 px-4 md:px-8 relative z-50 gap-4">
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-[#0A2647] mb-1">
          {t.topbar.welcome.replace("{name}", profile?.nama || "Pengguna")}
        </h1>
        <p className="text-slate-600 text-xs md:text-sm">
          {t.topbar.summary}
        </p>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto mt-2 md:mt-0">
        <button className="relative text-[#0A2647] hover:text-blue-600 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-slate-50 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-slate-300 rounded-full overflow-hidden border border-slate-200">
             {profile?.foto ? (
               <img src={profile.foto} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-slate-300"></div>
             )}
          </div>
          <div className="flex items-center gap-1 font-medium text-[#0A2647] text-sm group-hover:text-blue-600 transition-colors">
            {profile ? getFirstName(profile.nama) : "User"} <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}