"use client"

import { usePathname } from "next/navigation";
import Topbar from "./Topbar";

export default function ConditionalTopbar() {
  const pathname = usePathname();
  
  // Hanya tampilkan Topbar jika URL adalah /beranda
  if (pathname !== "/beranda") return null;
  
  return <Topbar />;
}
