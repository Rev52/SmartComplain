"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const features = [
  {
    title: "Mudah Digunakan",
    description: "Buat laporan fasilitas publik dengan cepat dan sederhana.",
    icon: UserCheck,
  },
  {
    title: "Transparan",
    description: "Setiap perkembangan laporan dapat dipantau oleh pengguna.",
    icon: Sparkles,
  },
  {
    title: "Untuk Surabaya",
    description: "Bantu kota menjadi lebih tertata dan responsif.",
    icon: User,
  },
];

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Kata sandi dan konfirmasi sandi tidak cocok.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          nama: formData.nama.trim(),
          telepon: formData.telepon.trim(),
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: formData.nama.trim(),
        email: formData.email.trim(),
        phone: formData.telepon.trim(),
        role: "user",
      });

      if (profileError) {
        setErrorMsg(profileError.message);
        setLoading(false);
        return;
      }
    }

    await supabase.auth.signOut();

    setLoading(false);
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-white px-10 py-10 text-[#082b4c] lg:flex lg:flex-col lg:justify-between xl:px-16">
          <div>
            <Image
              src="/LOGO2.png"
              alt="SmartComplain"
              width={240}
              height={90}
              className="h-16 w-auto object-contain"
              priority
            />

            <div className="mt-16 max-w-xl">
              <p className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                SmartComplain Surabaya
              </p>

              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                Daftar dan mulai laporkan fasilitas publik
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
                Buat akun untuk mengirim laporan, menambahkan lokasi, serta
                memantau status pengaduan secara digital.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {features.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#082b4c]">
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#082b4c]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
          <div className="absolute inset-0">
            <Image
              src="/background register.png"
              alt="Background Surabaya"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-slate-950/45" />
          </div>

          <div className="relative z-10 w-full max-w-2xl">
            <div className="mb-6 flex justify-center lg:hidden">
              <div className="rounded-2xl bg-white px-5 py-3 shadow-lg">
                <Image
                  src="/LOGO2.png"
                  alt="SmartComplain"
                  width={180}
                  height={70}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#082b4c] p-6 shadow-2xl sm:p-8">
              <div className="mb-7 text-center">
                <p className="text-sm font-medium text-blue-200">
                  Akun pengguna baru
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Daftar SmartComplain
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Lengkapi data berikut untuk mulai membuat laporan.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100">
                  {errorMsg}
                </div>
              )}

              <form
                className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                onSubmit={handleRegister}
              >
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Nama Lengkap
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      className="w-full rounded-2xl border border-transparent bg-white px-4 py-3.5 pl-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-400/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan email"
                      className="w-full rounded-2xl border border-transparent bg-white px-4 py-3.5 pl-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-400/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    No. Telepon
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleChange}
                      placeholder="Masukkan no. telepon"
                      className="w-full rounded-2xl border border-transparent bg-white px-4 py-3.5 pl-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-400/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Kata Sandi
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan kata sandi"
                      className="w-full rounded-2xl border border-transparent bg-white px-4 py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-400/20"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
                      aria-label={
                        showPassword
                          ? "Sembunyikan kata sandi"
                          : "Tampilkan kata sandi"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Konfirmasi Sandi
                  </label>

                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Ulangi kata sandi"
                      className="w-full rounded-2xl border border-transparent bg-white px-4 py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-400/20"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
                      aria-label={
                        showConfirmPassword
                          ? "Sembunyikan konfirmasi sandi"
                          : "Tampilkan konfirmasi sandi"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-[#082b4c] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {loading ? "Memproses..." : "Daftar Sekarang"}
                  </button>
                </div>
              </form>

              <p className="mt-7 text-center text-sm text-slate-300">
                Sudah memiliki akun?{" "}
                <Link
                  href="/login"
                  className="font-bold text-white hover:underline"
                >
                  Login di sini
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}