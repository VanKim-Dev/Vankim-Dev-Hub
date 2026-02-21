// components/SidebarContent.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, Settings, LogOut, Home, Languages, Globe } from "lucide-react";
import { cn } from "@/lib/utils"; // cn 함수는 따로 빼두는 게 좋습니다
import { ModeToggle } from "@/components/ModeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { i18n } from "@/locales";
import { createClient } from '@/lib/supabase'

export default function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const supabase = createClient()
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();
  const t = i18n[language];

  const menuItems = [
    { name: t.sidebar.home, href: "/", icon: Home },
    { name: t.sidebar.finance, href: "/finance", icon: Wallet },
    { name: t.sidebar.crypto, href: "/crypto", icon: Globe },
    { name: t.sidebar.settings, href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* 로고 영역 */}
      <div className="p-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={onItemClick}>
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <LayoutDashboard size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white italic">
            VanKim Hub
          </span>
        </Link>
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                isActive 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 하단 설정 영역 (기존 코드와 동일) */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {/* 언어 전환 버튼 */}
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {t.sidebar.language}
          </span>
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Languages size={14} />
            {language.toUpperCase()}
          </button>
        </div>

        {/* 다크모드 토글 */}
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {t.sidebar.appearance}
          </span>
          <ModeToggle />
        </div>

        {/* ✅ 로그아웃 버튼: 다른 메뉴와 구분되도록 살짝 여백(mt-4)을 주고 색상 강조 */}
        <button 
            onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = '/'
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all mt-4"
        >
            <LogOut size={20} />
            {t.sidebar.logout}
        </button>
      </div>
    </div>
  );
}