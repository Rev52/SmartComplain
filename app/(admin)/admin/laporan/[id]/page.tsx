import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
              <p className="detail-value">{laporan.id}</p>
            </div>

            <div>
              <p className="detail-label">Status</p>
              <p className="detail-value">{laporan.status || "-"}</p>
            </div>

            <div>
              <p className="detail-label">Kategori</p>
              <p className="detail-value">{laporan.kategori || "-"}</p>
            </div>

            <div>
              <p className="detail-label">Prioritas</p>
              <p className="detail-value">{laporan.prioritas || "-"}</p>
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

          <div style={{ marginTop: "1.5rem" }}>
            <p className="detail-label">Deskripsi</p>
            <p className="detail-value">
              {laporan.deskripsi || laporan.description || "-"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}