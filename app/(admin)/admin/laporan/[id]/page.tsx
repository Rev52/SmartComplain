import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DetailLaporanAdminPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: laporan, error } = await supabase
    .from("laporan")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !laporan) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="page-header">
        <Link
          href="/admin/laporan"
          className="mb-2 text-sm font-medium text-blue-600 hover:underline"
        >
          ← Kembali ke daftar laporan
        </Link>

        <h1 className="page-title">Detail Laporan</h1>
        <p className="page-subtitle">
          Informasi lengkap laporan dari pengguna.
        </p>
      </div>

      <section className="card">
        <div className="card-header">
          <h2 className="card-title">
            {laporan.judul || "Laporan tanpa judul"}
          </h2>
        </div>

        <div className="card-body">
          <div className="detail-grid">
            <div>
              <p className="detail-label">ID Laporan</p>
              <p className="detail-value break-all">{laporan.id}</p>
            </div>

            <div>
              <p className="detail-label">Status</p>
              <p className="detail-value capitalize">
                {laporan.status || "-"}
              </p>
            </div>

            <div>
              <p className="detail-label">Kategori</p>
              <p className="detail-value">{laporan.kategori || "-"}</p>
            </div>

            <div>
              <p className="detail-label">Prioritas</p>
              <p className="detail-value capitalize">
                {laporan.prioritas || "-"}
              </p>
            </div>

            <div>
              <p className="detail-label">Lokasi</p>
              <p className="detail-value">{laporan.lokasi || "-"}</p>
            </div>

            <div>
              <p className="detail-label">Tanggal Dibuat</p>
              <p className="detail-value">
                {laporan.created_at
                  ? new Date(laporan.created_at).toLocaleString("id-ID")
                  : "-"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="detail-label">Deskripsi</p>
            <p className="detail-value whitespace-pre-line">
              {laporan.deskripsi || laporan.description || "-"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}