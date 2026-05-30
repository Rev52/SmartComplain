"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const features = [
  {
    title: "Mudah Digunakan",
    description: "Laporkan keluhan fasilitas publik dalam beberapa langkah.",
    icon: UserCheck,
  },
  {
    title: "Transparan",
    description: "Pantau status laporan secara jelas dan terbuka.",
    icon: Sparkles,
  },
  {
    title: "Untuk Surabaya",
    description: "Bersama membangun kota yang lebih nyaman.",
    icon: User,
  },
];

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setErrorMsg("Email atau kata sandi salah.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setErrorMsg("User tidak ditemukan.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setLoading(false);
      setErrorMsg("Gagal mengambil data profil.");
      return;
    }

    if (profile?.role === "admin") {
      router.push("/admin/beranda");
    } else {
      router.push("/beranda");
    }

    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-[#082b4c] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
          <div>
            <Image
              src="/LOGO.png"
              alt="SmartComplain"
              width={240}
              height={90}
              className="h-16 w-auto object-contain"
              priority
            />

            <div className="mt-16 max-w-xl">
              <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-blue-100">
                SmartComplain Surabaya
              </p>

              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                Platform Pengaduan Fasilitas Publik Modern
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-blue-100">
                Laporkan masalah fasilitas publik, pantau progres, dan bantu
                wujudkan pelayanan kota yang lebih responsif.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {features.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-6 w-6 text-blue-100" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-blue-100">
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
              src="/background login.png"
              alt="Background Surabaya"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-slate-950/45" />
          </div>

          <div className="relative z-10 w-full max-w-md">
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
                  Selamat datang kembali
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Login ke SmartComplain
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Masuk untuk melihat dan mengelola laporan pengaduan.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100">
                  {errorMsg}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-[#082b4c] shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? "Memproses..." : "Login"}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-slate-300">
                Belum memiliki akun?{" "}
                <Link
                  href="/register"
                  className="font-bold text-white hover:underline"
                >
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}