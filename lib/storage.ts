import { createClient } from "@/lib/supabase/client"

export async function uploadFoto(file: File, userId: string): Promise<string | null> {
    const supabase = createClient()

    const ext = file.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${ext}`

    const { error } = await supabase.storage
        .from("laporan-foto")
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        })

    if (error) {
        console.error("Upload error:", error)
        return null
    }

    const { data } = supabase.storage
        .from("laporan-foto")
        .getPublicUrl(fileName)

    return data.publicUrl
}

export async function deleteFoto(url: string) {
    const supabase = createClient()

    // Ekstrak path dari URL
    const path = url.split("/laporan-foto/")[1]
    if (!path) return

    await supabase.storage
        .from("laporan-foto")
        .remove([path])
}