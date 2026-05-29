"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, X } from "lucide-react";
import { useLanguage } from "@/utils/languageStorage";
import { createClient } from "@/lib/supabase/client";

type ProfileData = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  alamat: string | null;
  avatar_url: string | null;
};

export default function ProfilSayaPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    alamat: "",
  });

  const [fotoProfil, setFotoProfil] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, email, phone, alamat, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Gagal mengambil profil:", error.message);
      }

      const profileData = profile as ProfileData | null;

      setFormData({
        nama: profileData?.full_name || "",
        email: profileData?.email || user.email || "",
        telepon: profileData?.phone || "",
        alamat: profileData?.alamat || "",
      });

      setFotoProfil(profileData?.avatar_url || null);
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFotoProfil(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User error:", userError?.message);
      setSaving(false);
      router.replace("/login");
      return;
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        full_name: formData.nama,
        email: user.email,
        phone: formData.telepon,
        alamat: formData.alamat,
        avatar_url: fotoProfil,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    );

    if (error) {
      console.error("Gagal menyimpan profil:", error.message);
      alert("Gagal menyimpan profil: " + error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
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

  if (loading) {
    return (
      <div className="max-w-5xl relative z-10 -mt-2 pb-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200 text-slate-600">
          Memuat profil...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl relative z-10 -mt-2 pb-10">
      <div className="mt-4 mb-6">
        <h1 className="text-[32px] font-bold text-[#0A2647] mb-2">
          {t.profil.title}
        </h1>
        <p className="text-slate-600 text-[15px]">{t.profil.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 bg-white/95 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col items-center text-center">
          <label
            htmlFor="upload-profil"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 bg-slate-200 border-4 border-white shadow-md relative cursor-pointer group flex items-center justify-center"
          >
            {fotoProfil ? (
              <img
                src={fotoProfil}
                alt="Profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-400 text-sm">
                {t.profil.fotoProfil}
              </span>
            )}

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">
                {t.profil.ubahFoto}
              </span>
            </div>

            <input
              id="upload-profil"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleFotoChange}
            />
          </label>

          <h2 className="text-xl font-bold text-[#0A2647] mb-2">
            {formData.nama || "Nama Pengguna"}
          </h2>
          <p className="text-sm text-slate-500 font-medium mb-1.5">
            {formData.email}
          </p>
          <p className="text-sm text-slate-500 font-medium">
            {formData.telepon}
          </p>
        </div>

        <div className="col-span-1 md:col-span-2 bg-white/95 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-[#0A2647] mb-6">
            {t.profil.infoPribadi}
          </h3>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#0A2647]">
                {t.profil.nama}
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#0A2647]">
                {t.profil.email}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-100 text-sm text-slate-500 focus:outline-none shadow-sm cursor-not-allowed"
              />
              <p className="text-xs text-slate-400">
                Email login tidak diubah dari halaman profil.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#0A2647]">
                {t.profil.telepon}
              </label>
              <input
                type="tel"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#0A2647]">
                {t.profil.alamat}
              </label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#124B8F] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0A2647] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Menyimpan..." : t.profil.simpan}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-[#124B8F]" />
          </div>
          <div>
            <h4 className="font-bold text-[#0A2647] text-[15px] mb-0.5">
              {t.profil.ubahPasswordTitle}
            </h4>
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

      <div
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-center gap-3 bg-[#124B8F] text-white px-5 py-4 rounded-xl shadow-lg border border-blue-800 transition-all duration-300 transform ${showToast
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0 pointer-events-none"
          }`}
      >
        <CheckCircle2 className="w-6 h-6 text-green-400" />
        <div>
          <h4 className="font-bold text-sm">Berhasil!</h4>
          <p className="text-xs text-blue-100 font-medium mt-0.5">
            {t.profil.alertSukses}
          </p>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 transition-all">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0A2647]">
                {t.profil.ubahPasswordTitle}
              </h2>
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