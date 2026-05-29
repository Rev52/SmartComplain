"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    BarChart3,
    FileText,
    Home,
    LogOut,
    Map,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const menuItems = [
    {
        name: "Beranda",
        href: "/admin/beranda",
        icon: Home,
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

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-100">
            {/* Mobile Topbar */}
            <header className="sticky top-0 z-900 flex h-16 items-center justify-between bg-[#082b4c] px-4 shadow-md lg:hidden">
                <Link href="/admin/beranda" className="flex items-center">
                    <Image
                        src="/LOGO.png"
                        alt="SmartComplain"
                        width={160}
                        height={56}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20"
                    aria-label="Buka menu admin"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Tutup menu admin"
                    className="fixed inset-0 z-9900 bg-black/45 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-9999 flex w-72 max-w-[82vw] flex-col bg-[#082b4c] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
                    <Link href="/admin/beranda" onClick={() => setIsSidebarOpen(false)}>
                        <Image
                            src="/LOGO.png"
                            alt="SmartComplain"
                            width={170}
                            height={60}
                            className="h-11 w-auto object-contain"
                            priority
                        />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="rounded-xl p-2 text-white/80 transition hover:bg-white/10 lg:hidden"
                        aria-label="Tutup menu admin"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 px-4 py-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                        : "text-white/75 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-white/10 p-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-white/10"
                    >
                        <LogOut size={18} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="min-h-screen w-full max-w-full overflow-x-hidden lg:pl-72">
                <div className="mx-auto w-full max-w-7xl">{children}</div>
            </main>
        </div>
    );
}