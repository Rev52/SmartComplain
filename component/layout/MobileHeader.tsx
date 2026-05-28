"use client"

import { Menu } from "lucide-react";
import Image from "next/image";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="md:hidden flex items-center justify-between bg-[#0A2647] text-white p-4 sticky top-0 z-30 shadow-md">
      <div className="flex items-center gap-3">
        <Image src="/LOGO.png" alt="SmartComplain" width={100} height={30} className="h-10 w-auto object-contain" />
      </div>
      <button 
        onClick={onMenuClick}
        className="p-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
}
