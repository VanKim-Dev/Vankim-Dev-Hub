// components/MobileNav.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarContent from "./SidebarContent";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-400">
        <Menu size={24} />
      </button>

      {/* 모바일 서랍장(Drawer) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* 배경 어둡게 */}
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          {/* 슬라이드 메뉴 */}
          <div className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-slate-950 shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-8 p-2 text-slate-400"
            >
              <X size={20} />
            </button>
            
            {/* 알맹이 재사용 */}
            <SidebarContent onItemClick={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}