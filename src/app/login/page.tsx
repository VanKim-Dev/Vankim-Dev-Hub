"use client";

import { supabase } from "@/lib/supabase";
import { Languages, LogIn, UserCheck } from "lucide-react";
import { i18n } from "@/locales";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { language, toggleLanguage } = useLanguage();
  const t = i18n[language];

  const handleGuestLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "guest@example.com",
      password: "guestpassword123!",
    });

    if (!error) {
      window.location.href = "/finance";
    } else {
      alert(t.login.errorGuest);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* 언어 변환 버튼 */}
      <button 
        onClick={toggleLanguage}
        className="fixed top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow-sm text-sm font-semibold hover:bg-slate-50 transition-colors"
      >
        <Languages size={16} />
        {language === "ko" ? "English" : "한국어"}
      </button>

      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-200">
          <LogIn className="text-white" size={40} />
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-2 italic">VanKim Hub</h1>
        
        <p className="text-slate-500 font-medium mb-10 whitespace-pre-line">
          {t.login.description}
        </p>

        <div className="space-y-4">
          {/* 구글 로그인 */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="google" />
            {t.login.google}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-bold">{t.login.or}</span>
            </div>
          </div>

          {/* 게스트 로그인 */}
          <button 
            onClick={handleGuestLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 rounded-2xl font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 group"
          >
            <UserCheck size={20} className="group-hover:scale-110 transition-transform" />
            {t.login.guest}
          </button>
        </div>

        <p className="mt-8 text-xs text-slate-400 font-medium">
          © 2026 VanKim Dev. Secured by Supabase Auth.
        </p>
      </div>
    </div>
  );
}