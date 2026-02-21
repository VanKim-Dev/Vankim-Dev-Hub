"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BarChart2, Globe, Languages, Moon, Sun } from "lucide-react";
import { i18n, Language } from "@/locales";
import { useTheme } from "next-themes";

export default function Home() {
  const [lang, setLang] = useState<Language>("ko");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = i18n[lang];

  useEffect(() => setMounted(true), []);

  return (
    // 1. 전체 배경색: 크립토 대시보드와 같은 짙은 네이비 계열(slate-950)로 변경
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-10 px-4 bg-slate-50/50 dark:bg-[#0f172a] transition-colors duration-500">

      {/* 고정형 컨트롤러 그룹 */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:shadow-md transition-all text-slate-700 dark:text-slate-200"
          aria-label="Toggle Theme"
        >
          {mounted && (theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />)}
        </button>

        <button 
          onClick={() => setLang(lang === "ko" ? "en" : "ko")}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:shadow-md transition-all text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          <Languages size={18} className="text-blue-600 dark:text-blue-400" />
          {lang === "ko" ? "English" : "한국어"}
        </button>
      </div>

      {/* 프로필 섹션 */}
      <div className="mb-10 flex flex-col items-center group">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl mb-6 transition-transform group-hover:scale-105">
          <img 
            src="/images/vankimdev.png" 
            alt="VanKim Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 italic tracking-tighter">VanKim</h2>
        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <p className="text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">{t.common.subtitle}</p>
        </div>
      </div>

      {/* 메인 타이틀 섹션 */}
      <div className="max-w-3xl text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-slate-900 dark:text-white">
          VanKim <span className="text-blue-600 dark:text-blue-500">Dev Hub</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed break-keep">
          {t.home.mainDesc}
        </p>
      </div>

      {/* 프로젝트 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Finance Dashboard */}
        <Link 
          href="/finance" 
          className="group relative p-10 bg-white dark:bg-[#030617] border border-slate-200 dark:border-slate-800/50 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 text-left backdrop-blur-sm"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="p-5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
              <BarChart2 size={32} />
            </div>
            <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800/50 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
              <ArrowRight className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mb-4 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t.home.financeTitle}</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.home.financeDesc}</p>
        </Link>

        {/* Crypto Tracker */}
        <Link 
          href="/crypto" 
          className="group relative p-10 bg-white dark:bg-[#030617] border border-slate-200 dark:border-slate-800/50 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 text-left overflow-hidden backdrop-blur-sm"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner z-10">
              <Globe size={32} />
            </div>
            <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800/50 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors z-10">
              <ArrowRight className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mb-4 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors z-10">
            {t.home.cryptoTitle}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed z-10">
            {t.home.cryptoDesc}
          </p>
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] dark:opacity-[0.07] text-indigo-900 dark:text-indigo-400 rotate-12 transition-opacity">
            <Globe size={200} />
          </div>
        </Link>
      </div>

      <footer className="mt-20 text-slate-400 dark:text-slate-600 text-sm font-medium">
        © 2026 VanKim Dev. All rights reserved.
      </footer>
    </div>
  );
}