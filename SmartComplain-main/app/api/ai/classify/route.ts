import { NextRequest, NextResponse } from "next/server";
import { classifyLaporan } from "@/lib/openrouter";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { deskripsi } = await request.json();

  if (!deskripsi || deskripsi.trim().length < 10) {
    return NextResponse.json(
      { error: "Deskripsi terlalu pendek" },
      { status: 400 }
    );
  }

  const result = await classifyLaporan(deskripsi);

  if (!result) {
    return NextResponse.json(
      { error: "Gagal mengklasifikasi laporan" },
      { status: 500 }
    );
  }

  return NextResponse.json(result);
}
