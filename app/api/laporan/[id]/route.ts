import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("laporan")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { message: "Laporan tidak ditemukan", error: error.message },
      { status: 404 }
    );
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();

  const body = await request.json();

  const allowedFields = [
    "status",
    "kategori",
    "prioritas",
    "ringkasan",
    "catatan_admin",
  ];

  const updateData: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { message: "Tidak ada data yang diperbarui" },
      { status: 400 }
    );
  }

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("laporan")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { message: "Gagal memperbarui laporan", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Laporan berhasil diperbarui",
    data,
  });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();

  const { error } = await supabase.from("laporan").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: "Gagal menghapus laporan", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Laporan berhasil dihapus",
  });
}
