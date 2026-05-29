// app/(admin)/layout.tsx
import "@/app/admin.css";
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminSidebar from "@/component/layout/AdminSidebar"
import AdminTopbar from "@/component/layout/AdminTopbar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    if (profile?.role !== "admin") redirect("/beranda")

    return (
        <div className="admin-wrap">
            <AdminSidebar profile={profile} />

            <div className="admin-content">
                <AdminTopbar profile={profile} />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}