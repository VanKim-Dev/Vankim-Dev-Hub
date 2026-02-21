"use client";

import { UserCheck } from "lucide-react";

interface SocialAuthProps {
  onGoogle: () => void;
  onGuest: () => void;
}

export default function SocialAuth({ onGoogle, onGuest }: SocialAuthProps) {
  return (
    <>
      <div className="relative py-4 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-[#030617] px-2 text-slate-400 font-bold tracking-widest transition-colors">OR</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onGoogle} 
          className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="16" alt="google" /> Google
        </button>
        <button 
          onClick={onGuest} 
          className="flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
        >
          <UserCheck size={16} /> Guest
        </button>
      </div>
    </>
  );
}