"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart2, Globe, Languages } from "lucide-react";
import { i18n, Language } from "@/locales"; // 다국어 데이터 임포트

export default function Home() {
  const [lang, setLang] = useState<Language>("ko");
  const t = i18n[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-10 px-4 bg-slate-50/50">
      {/* 고정형 언어 전환 버튼 */}
      <button 
        onClick={() => setLang(lang === "ko" ? "en" : "ko")}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all text-sm font-semibold text-slate-700"
      >
        <Languages size={18} className="text-blue-600" />
        {lang === "ko" ? "English" : "한국어"}
      </button>

      {/* 프로필 섹션: 사진과 타이틀의 균형 개선 */}
      <div className="mb-10 flex flex-col items-center group">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 transition-transform group-hover:scale-105">
          <img 
            src="/images/vankimdev.png" 
            alt="VanKim Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-1 italic tracking-tighter">VanKim</h2>
        <div className="px-3 py-1 bg-blue-100 rounded-full">
          <p className="text-blue-700 font-bold text-xs uppercase tracking-widest">{t.common.subtitle}</p>
        </div>
      </div>

      {/* 메인 타이틀 섹션 */}
      <div className="max-w-3xl text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-slate-900">
          VanKim <span className="text-blue-600">Dev Hub</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed break-keep">
          {t.home.mainDesc}
        </p>
      </div>

      {/* 프로젝트 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Finance Dashboard */}
        <Link 
          href="/finance" 
          className="group relative p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="p-5 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
              <BarChart2 size={32} />
            </div>
            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
              <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">{t.home.financeTitle}</h3>
          <p className="text-slate-500 font-medium leading-relaxed">{t.home.financeDesc}</p>
        </Link>

        {/* Crypto Tracker (Coming Soon) */}
        <div className="p-10 bg-slate-100/50 border border-dashed border-slate-300 rounded-[2.5rem] text-left relative overflow-hidden group">
          <div className="flex justify-between items-start mb-8">
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-300">
              <Globe size={32} />
            </div>
            <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-3 py-1.5 rounded-lg uppercase tracking-widest">Coming Soon</span>
          </div>
          <h3 className="text-2xl font-extrabold mb-4 text-slate-400">{t.home.cryptoTitle}</h3>
          <p className="text-slate-400 font-medium leading-relaxed">{t.home.cryptoDesc}</p>
          
          {/* 장식용 배경 효과 */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] text-slate-900 rotate-12">
            <Globe size={200} />
          </div>
        </div>
      </div>

      {/* 푸터 영역 (선택사항) */}
      <footer className="mt-20 text-slate-400 text-sm font-medium">
        © 2026 VanKim Dev. All rights reserved.
      </footer>
    </div>
  );
}