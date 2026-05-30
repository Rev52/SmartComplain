import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0A2647] text-white py-12 px-8 md:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
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
          <p className="text-sm text-gray-300 pr-4">
            Platform pengaduan fasilitas publik modern warga Surabaya
          </p>
          <p className="text-xs text-gray-400">
            © 2026 SmartComplain. All rights reserved.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h4 className="font-bold mb-4">Menu</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/" className="hover:text-white">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="#tentang" className="hover:text-white">
                Tentang
              </Link>
            </li>
            <li>
              <Link href="#fitur" className="hover:text-white">
                Fitur
              </Link>
            </li>
            <li>
              <Link href="#cara-kerja" className="hover:text-white">
                Cara Kerja
              </Link>
            </li>
            <li>
              <Link href="/laporan" className="hover:text-white">
                Laporan
              </Link>
            </li>
          </ul>
        </div>

        {/* Tautan Cepat */}
        <div>
          <h4 className="font-bold mb-4">Tautan Cepat</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/laporan/buat" className="hover:text-white">
                Buat Laporan
              </Link>
            </li>
            <li>
              <Link href="/cek-status" className="hover:text-white">
                Cek Status
              </Link>
            </li>
            <li>
              <Link href="/peta" className="hover:text-white">
                Peta Lokasi
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="font-bold mb-4">Kontak</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> SmartComplain@hotmail.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> (031) 87604297
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Surabaya, Jawa Timur
            </li>
          </ul>
          <div className="flex gap-4 mt-6">
            <Link href="#" className="hover:text-blue-400">
              <FaInstagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-blue-400">
              <FaTwitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-blue-400">
              <FaFacebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-blue-400">
              <FaYoutube className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
