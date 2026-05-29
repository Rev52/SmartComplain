"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Globe,
  Lock,
  Info,
  ChevronDown,
  Check,
  X,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const dictionary = {
  id: {
    title: "Pengaturan",
    subtitle: "Atur preferensi dan keamanan akun Anda.",
    notifTitle: "Notifikasi",
    notifDesc: "Kelola preferensi notifikasi Anda.",
    langTitle: "Bahasa",
    langDesc: "Pilih bahasa yang Anda gunakan.",
    secTitle: "Keamanan",
    secDesc: "Atur keamanan akun Anda.",
    secBtn: "Ubah Password",
    aboutTitle: "Tentang",
    aboutDesc: "Informasi tentang SmartComplain.",
    version: "Versi 1.0.0",
  },
  en: {
    title: "Settings",
    subtitle: "Manage your account preferences and security.",
    notifTitle: "Notifications",
    notifDesc: "Manage your notification preferences.",
    langTitle: "Language",
    langDesc: "Choose your preferred language.",
    secTitle: "Security",
    secDesc: "Manage your account security.",
    secBtn: "Change Password",
    aboutTitle: "About",
    aboutDesc: "Information about SmartComplain.",
    version: "Version 1.0.0",
  },
};

export default function PengaturanPage() {
  const router = useRouter();

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);

  const [language, setLanguage] = useState<"id" | "en">("id");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("smartcomplain_lang") as
      | "id"
      | "en"
      | null;

    if (savedLang === "id" || savedLang === "en") {
      setLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as "id" | "en";
    setLanguage(newLang);
    localStorage.setItem("smartcomplain_lang", newLang);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess(false);
    setPasswordLoading(true);

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter!");
      setPasswordLoading(false);
      return;
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPasswordError("Sesi login tidak ditemukan. Silakan login ulang.");
      setPasswordLoading(false);
      router.replace("/login");
      return;
    }

    if (!user.email) {
      setPasswordError("Email akun tidak ditemukan.");
      setPasswordLoading(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: passwordForm.oldPassword,
    });

    if (verifyError) {
      setPasswordError("Password lama tidak sesuai!");
      setPasswordLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordForm.newPassword,
    });

    if (updateError) {
      setPasswordError(updateError.message);
      setPasswordLoading(false);
      return;
    }

    setPasswordSuccess(true);
    setPasswordLoading(false);

    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
      });
      setPasswordSuccess(false);
    }, 2000);
  };

  const t = dictionary[language];

  const CustomCheckbox = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${checked
          ? "bg-[#124B8F] border-[#124B8F]"
          : "bg-white border-slate-300 group-hover:border-[#124B8F]"
          }`}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white stroke-3" />}
      </div>

      <span className="text-[15px] font-semibold text-slate-600 select-none">
        {label}
      </span>

      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );

  return (
    <div className="max-w-4xl relative z-10 -mt-2">
      <div className="mt-4 mb-8">
        <h1 className="text-[32px] font-bold text-[#0A2647] mb-2">
          {t.title}
        </h1>
        <p className="text-slate-600 text-[15px]">{t.subtitle}</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="bg-[#F8FAFC]/95 backdrop-blur-sm p-5 md:p-6 lg:px-8 lg:py-7 rounded-[20px] shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-5">
            <div className="text-[#124B8F]">
              <Bell className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0A2647] mb-1">
                {t.notifTitle}
              </h3>
              <p className="text-[15px] text-slate-500">{t.notifDesc}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pl-14 md:pl-0">
            <CustomCheckbox
              label="Email"
              checked={notifEmail}
              onChange={() => setNotifEmail(!notifEmail)}
            />
            <CustomCheckbox
              label="Push Notification"
              checked={notifPush}
              onChange={() => setNotifPush(!notifPush)}
            />
            <CustomCheckbox
              label="SMS"
              checked={notifSMS}
              onChange={() => setNotifSMS(!notifSMS)}
            />
          </div>
        </div>

        <div className="bg-[#F8FAFC]/95 backdrop-blur-sm p-5 md:p-6 lg:px-8 lg:py-7 rounded-[20px] shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-5">
            <div className="text-[#124B8F]">
              <Globe className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0A2647] mb-1">
                {t.langTitle}
              </h3>
              <p className="text-[15px] text-slate-500">{t.langDesc}</p>
            </div>
          </div>

          <div className="pl-14 md:pl-0 w-full md:w-[240px]">
            <div className="relative">
              <select
                className="w-full pl-4 pr-10 py-2.5 bg-white rounded-lg text-[15px] font-semibold text-slate-600 shadow-sm border border-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>

              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-[#0A2647]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F8FAFC]/95 backdrop-blur-sm p-5 md:p-6 lg:px-8 lg:py-7 rounded-[20px] shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-5">
            <div className="text-[#124B8F]">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0A2647] mb-1">
                {t.secTitle}
              </h3>
              <p className="text-[15px] text-slate-500">{t.secDesc}</p>
            </div>
          </div>

          <div className="pl-14 md:pl-0">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-transparent border border-slate-300 text-[#124B8F] px-6 py-2.5 rounded-lg font-bold text-[15px] hover:bg-slate-50 transition-colors shadow-sm"
            >
              {t.secBtn}
            </button>
          </div>
        </div>

        <div className="bg-[#F8FAFC]/95 backdrop-blur-sm p-5 md:p-6 lg:px-8 lg:py-7 rounded-[20px] shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-5">
            <div className="text-[#124B8F]">
              <Info className="w-8 h-8" fill="currentColor" stroke="white" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0A2647] mb-1">
                {t.aboutTitle}
              </h3>
              <p className="text-[15px] text-slate-500">{t.aboutDesc}</p>
            </div>
          </div>

          <div className="pl-14 md:pl-0">
            <span className="text-[15px] font-semibold text-slate-600">
              {t.version}
            </span>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 transition-all">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0A2647]">{t.secBtn}</h2>

              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
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
                <CheckCircle2 className="w-5 h-5" />
                Password berhasil diubah!
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#0A2647]">
                  Password Lama
                </label>

                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      oldPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#0A2647]">
                  Password Baru
                </label>

                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
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
                  disabled={passwordLoading}
                  className="flex-1 bg-[#124B8F] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0A2647] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? "Menyimpan..." : "Simpan Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}