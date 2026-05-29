import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-[#0A2647] text-white py-4 px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <Image
            src="/LOGO.png"
            alt="SmartComplain"
            width={240}
            height={80}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link href="#tentang" className="hover:text-blue-300 transition-colors">
          Tentang
        </Link>
        <Link href="#fitur" className="hover:text-blue-300 transition-colors">
          Fitur
        </Link>
        <Link
          href="#cara-kerja"
          className="hover:text-blue-300 transition-colors"
        >
          Cara Kerja
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="bg-white text-[#0A2647] px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="bg-white text-[#0A2647] px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
