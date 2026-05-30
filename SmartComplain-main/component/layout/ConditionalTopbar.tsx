"use client";

import { usePathname } from "next/navigation";
import Topbar from "./Topbar";

export default function ConditionalTopbar() {
  const pathname = usePathname();

  if (pathname !== "/beranda") return null;

  return <Topbar />;
}
