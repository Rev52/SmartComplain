"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/utils/languageStorage";

export default function FAQPage() {
  const { t } = useLanguage();

  return (
    <>
      <div className="fixed inset-0 bg-white z-[-1]"></div>
      <div className="min-h-screen text-slate-800 font-sans relative z-10">
        <div className="max-w-5xl mx-auto py-8 md:py-12 px-4 md:px-8 lg:px-12">
        
        {/* 🔹 Tombol Kembali */}
        <Link 
          href="/bantuan" 
          className="inline-flex items-center gap-3 text-[#124B8F] font-bold mb-10 text-[17px] hover:text-[#0A2647] transition-colors"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" /> {t.faq.kembali}
        </Link>
        
        {/* 🔹 Judul & Garis Pembatas */}
        <h1 className="text-4xl font-bold text-[#0A2647] mb-6 tracking-tight">
          {t.faq.title}
        </h1>
        <hr className="border-t border-slate-300 mb-10" />
        
        {/* 🔹 Daftar FAQ */}
        <div className="flex flex-col gap-7">
          {t.faq.items.map((faq, index) => (
            <div 
              key={index} 
              className="rounded-[10px] overflow-hidden border border-[#0A2647] shadow-sm flex flex-col"
            >
              {/* Box Pertanyaan (Biru Gelap) */}
              <div className="bg-[#0A2647] text-white px-5 md:px-8 py-4 font-semibold text-[15px] md:text-[16px]">
                {faq.question}
              </div>
              
              {/* Box Jawaban (Putih / Abu-abu Terang) */}
              <div className="bg-[#F8FAFC] px-5 md:px-8 py-5 text-[14px] md:text-[15px] text-slate-600 leading-relaxed font-medium">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
    </>
  );
}