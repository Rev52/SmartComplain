export async function classifyLaporan(deskripsi: string): Promise<{
    kategori: string
    ringkasan: string
    prioritas: string
} | null> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://smartcomplain.vercel.app",
            "X-Title": "SmartComplain",
        },
        body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct:free",
            messages: [
                {
                    role: "system",
                    content: `Kamu adalah sistem klasifikasi laporan pengaduan fasilitas publik Kota Surabaya.
Tugasmu adalah menganalisis deskripsi laporan dan mengembalikan JSON dengan format berikut:
{
  "kategori": "salah satu dari: Jalan & Trotoar | Penerangan | Sampah | Drainase | Taman & RTH | Fasilitas Umum | Lainnya",
  "ringkasan": "ringkasan singkat 1 kalimat maksimal 20 kata",
  "prioritas": "salah satu dari: tinggi | sedang | rendah"
}

Aturan prioritas:
- tinggi: membahayakan keselamatan jiwa atau mengganggu akses utama warga
- sedang: mengganggu kenyamanan tapi tidak berbahaya langsung
- rendah: estetika atau gangguan minor

Balas HANYA dengan JSON, tanpa teks lain.`
                },
                {
                    role: "user",
                    content: `Klasifikasikan laporan ini:\n\n"${deskripsi}"`
                }
            ],
            temperature: 0.1,
            max_tokens: 200,
        }),
    })

    if (!response.ok) {
        console.error("OpenRouter error:", await response.text())
        return null
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content ?? ""

    try {
        const clean = text.replace(/```json|```/g, "").trim()
        return JSON.parse(clean)
    } catch {
        console.error("Parse error:", text)
        return null
    }
}