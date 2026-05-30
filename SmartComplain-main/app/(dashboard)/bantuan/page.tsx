"use client";

import Link from "next/link";
import {
  Search,
  Headset,
  Mail,
  Home,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  Lock,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import { useLanguage } from "@/utils/languageStorage";

export default function bantuanPage() {
  const { t } = useLanguage();
  return (
    <div className="max-w-6xl relative z-10 -mt-2 pb-10">
      {/* 🔹 Header Halaman */}
      <div className="mt-4 mb-6">
        <h1 className="text-[32px] font-bold text-[#0A2647] mb-2">
          {t.bantuan.title}
        </h1>
        <p className="text-slate-600 text-[15px]">{t.bantuan.desc}</p>
      </div>

      {/* 🔹 Banner Search */}
      <div className="bg-[#F8FAFC]/95 backdrop-blur-sm rounded-[20px] p-8 md:p-10 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between mb-8 overflow-hidden relative">
        <div className="w-full md:w-3/5 relative z-10">
          <h2 className="text-2xl font-bold text-[#0A2647] mb-2">
            {t.bantuan.bannerTitle}
          </h2>
          <p className="text-sm text-slate-600 mb-6">{t.bantuan.bannerDesc}</p>

          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={t.bantuan.cari}
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-slate-700"
            />
          </div>
        </div>

        {/* Gambar QnA */}
        <div className="hidden md:flex relative w-64 h-32 items-center justify-center">
          <img
            src="/QnA.png"
            alt="QnA"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* 🔹 Panduan Pengguna */}
      <div className="mb-8">
        <h3 className="font-bold text-slate-700 mb-4">{t.bantuan.panduan}</h3>
        <div className="bg-[#F8FAFC]/95 backdrop-blur-sm rounded-[20px] p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6">
            {/* Step 1 */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-600">
                {t.bantuan.step1}
              </p>
              <div className="bg-[#0A2647] rounded-xl p-3 h-28 border shadow-sm flex flex-col gap-1.5 overflow-hidden">
                <div className="w-full h-4 bg-white/10 rounded"></div>
                <div className="w-full h-4 bg-white/10 rounded"></div>
                <div className="w-full h-8 bg-[#1C4E8A] rounded border border-blue-400/30 flex items-center px-2 shadow-inner">
                  <span className="text-[10px] text-white font-medium">
                    {t.bantuan.step1Label}
                  </span>
                </div>
                <div className="w-full h-4 bg-white/10 rounded"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-600">
                {t.bantuan.step2}
              </p>
              <div className="bg-white rounded-xl p-3 h-28 border shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold text-[#0A2647] mb-1">
                  {t.bantuan.step2Label1}
                </p>
                <div className="w-full h-8 border border-slate-200 rounded flex items-center px-2 gap-2 bg-slate-50">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span className="text-[9px] text-slate-400">
                    {t.bantuan.step2Label2}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-600">
                {t.bantuan.step3}
              </p>
              <div className="bg-white rounded-xl p-3 h-28 border shadow-sm flex flex-col justify-center">
                <p className="text-[10px] font-bold text-[#0A2647] mb-1">
                  {t.bantuan.step3Label1}
                </p>
                <div className="w-full h-8 border border-slate-200 rounded flex items-center px-2 gap-2 bg-slate-50">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="text-[9px] text-slate-400">
                    {t.bantuan.step3Label2}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-600">
                {t.bantuan.step4}
              </p>
              <div className="bg-white rounded-xl p-3 h-28 border shadow-sm flex items-center justify-center">
                <div className="border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span className="text-[9px] font-semibold text-blue-600">
                    {t.bantuan.step4Label}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-600">
                {t.bantuan.step5}
              </p>
              <div className="bg-white rounded-xl p-3 h-28 border shadow-sm flex flex-col">
                <p className="text-[10px] font-bold text-[#0A2647] mb-1">
                  {t.bantuan.step5Label1}
                </p>
                <div className="w-full flex-1 border border-slate-200 rounded p-2 bg-slate-50">
                  <span className="text-[8px] text-slate-400">
                    {t.bantuan.step5Label2}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-600">
                {t.bantuan.step6}
              </p>
              <div className="bg-white rounded-xl p-3 h-28 border shadow-sm flex flex-col">
                <p className="text-[10px] font-bold text-[#0A2647] mb-1">
                  {t.bantuan.step6Label1}{" "}
                  <span className="text-[8px] text-slate-400 font-normal">
                    {t.bantuan.step6Label2}
                  </span>
                </p>
                <div className="w-full flex-1 border border-dashed border-slate-300 rounded flex items-center justify-center bg-slate-50/50">
                  <ImageIcon className="w-5 h-5 text-slate-300" />
                </div>
              </div>
            </div>

            {/* Step 7 */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-600">
                {t.bantuan.step7}
              </p>
              <div className="bg-white rounded-xl p-3 h-28 border shadow-sm flex items-center justify-center">
                <div className="w-full bg-[#124B8F] text-white font-semibold text-[11px] py-2 rounded text-center shadow-sm">
                  {t.bantuan.step7Label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 FAQ & Hubungi Kami */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kolom Kiri: FAQ */}
        <div className="bg-[#F8FAFC]/95 backdrop-blur-sm rounded-[20px] p-8 shadow-sm border border-slate-200 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-700">{t.bantuan.faqTitle}</h3>
            <Link
              href="/faq"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              {t.bantuan.faqLink}
            </Link>
          </div>

          <div className="flex flex-col border border-slate-200 rounded-xl bg-white overflow-hidden">
            {t.faq.items.map((faq, index) => (
              <div
                key={index}
                className="px-5 py-4 border-b border-slate-200 last:border-b-0 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                {faq.question}
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Hubungi Kami */}
        <div className="bg-[#F8FAFC]/95 backdrop-blur-sm rounded-[20px] p-8 shadow-sm border border-slate-200 h-fit">
          <h3 className="font-bold text-slate-700 mb-6">
            {t.bantuan.hubungiTitle}
          </h3>

          <div className="flex flex-col gap-4">
            {/* Card Call Center */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-5 shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Headset className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-[#0A2647] text-[15px] mb-0.5">
                  Call Center
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  031-2874-6525
                </p>
              </div>
            </div>

            {/* Card Email */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-5 shadow-sm hover:border-purple-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h4 className="font-bold text-[#0A2647] text-[15px] mb-0.5">
                  Email
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  support.smartcomplain@gmail.com
                </p>
              </div>
            </div>

            {/* Card Alamat */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-5 shadow-sm hover:border-orange-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <Home className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-[#0A2647] text-[15px] mb-0.5">
                  {t.bantuan.alamat}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {t.bantuan.alamatDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
