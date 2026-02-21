"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Languages, LogIn, Moon, Sun, UserPlus, ArrowLeft } from "lucide-react";
import { i18n } from "@/locales";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "next-themes";
import { toast } from "sonner";

// 분리한 컴포넌트 임포트
import AuthForm from "@/components/auth/AuthForm";
import SocialAuth from "@/components/auth/SocialAuth";

export default function LoginPage() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = i18n[language];

  // 하이드레이션 오류 방지
  useEffect(() => setMounted(true), []);

  const handleAuth = async (data: any) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: { data: { full_name: data.name } },
        });
        if (error) throw error;
        toast.success(language === "ko" ? "가입 성공! 메일을 확인해주세요." : "Signup success! Please check your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        window.location.href = "/finance";
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast.error(error.message);
  };

  const handleGuestLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "guest@example.com",
      password: "guestpassword123!",
    });
    if (!error) window.location.href = "/finance";
    else toast.error("Guest login failed.");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col items-center justify-center p-4 transition-colors duration-500">
      
      {/* --- 고정형 컨트롤러 그룹 (Theme + Language) --- */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:shadow-md transition-all text-slate-700 dark:text-slate-200"
          aria-label="Toggle Theme"
        >
          {mounted && (theme === "dark" ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-blue-600" />
          ))}
        </button>

        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:shadow-md transition-all text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          <Languages size={18} className="text-blue-600 dark:text-blue-400" />
          {language === "ko" ? "English" : "한국어"}
        </button>
      </div>
      {/* ------------------------------------------ */}

      <div className="w-full max-w-md bg-white dark:bg-[#030617] p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800/50 text-center backdrop-blur-sm transition-all duration-500">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
          {isSignUp ? <UserPlus className="text-white" size={32} /> : <LogIn className="text-white" size={32} />}
        </div>

        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 italic tracking-tighter">
          {isSignUp ? (language === "ko" ? "계정 생성" : "Create Account") : "VanKim Hub"}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">
          {isSignUp ? (language === "ko" ? "오늘 바로 시작하세요!" : "Join us today!") : t.login.description}
        </p>

        {/* 인증 폼 */}
        <AuthForm isSignUp={isSignUp} isLoading={isLoading} onSubmit={handleAuth} />

        {/* 소셜 인증 */}
        <SocialAuth onGoogle={handleGoogleLogin} onGuest={handleGuestLogin} />

        {/* 모드 전환 링크 */}
        <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800/50">
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-2 mx-auto transition-all"
          >
            {isSignUp ? (
              <><ArrowLeft size={16} /> {language === "ko" ? "로그인으로 돌아가기" : "Back to Login"}</>
            ) : (
              <><UserPlus size={16} /> {language === "ko" ? "새 계정 만들기" : "Create an account"}</>
            )}
          </button>
        </div>
      </div>

      <footer className="mt-8 text-xs text-slate-400 dark:text-slate-600 font-medium">
        © 2026 VanKim Dev. Secured by Supabase Auth.
      </footer>
    </div>
  );
}