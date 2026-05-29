"use client";

import { usePathname } from "next/navigation";

export default function DynamicBackground() {
  const pathname = usePathname();

  let bgImage = "url('/beranda.png')";

  if (pathname === "/buat") {
    bgImage = "url('/buat laporan.png')";
  } else if (pathname === "/beranda") {
    bgImage = "url('/beranda.png')";
  } else if (pathname === "/laporan") {
    bgImage = "url('/laporan saya background.png')";
  } else if (pathname === "/notifikasi") {
    bgImage = "url('/notifikasi background.png')";
  } else if (pathname === "/pengaturan") {
    bgImage = "url('/pengaturan background.png')";
  } else if (pathname === "/profil") {
    bgImage = "url('/profil saya background.png')";
  } else if (pathname === "/bantuan") {
    bgImage = "url('/bantuan background.png')";
  }

  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-white/10 z-10 backdrop-blur-[1px]"></div>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-all duration-300"
        style={{ backgroundImage: bgImage }}
      ></div>
    </div>
  );
}
