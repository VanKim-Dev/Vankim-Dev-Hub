"use client";

import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
import { Languages, LogIn, Moon, Sun, UserPlus, ArrowLeft } from "lucide-react";
import { i18n } from "@/locales";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { login, signup, signInWithGoogle, loginAsGuest } from "./actions";

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
    
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.name) formData.append("name", data.name);

    try {
      let result;
      if (isSignUp) {
        result = await signup(formData);
        // 회원가입은 보통 바로 리다이렉트하지 않고 메시지를 보여주므로 result 확인
        if (result?.error) throw new Error(result.error);
        toast.success(language === "ko" ? "가입 성공! 메일을 확인해주세요." : "Signup success! Check your email.");
      } else {
        result = await login(formData);
        // 로그인 성공 시에는 서버에서 redirect를 던지므로 이 아래 코드는 실행되지 않습니다.
        // 하지만 만약 서버에서 에러 객체를 리턴했다면 여기서 잡아냅니다.
        if (result?.error) throw new Error(result.error);
      }
    } catch (error: any) {
      // 💡 핵심: NEXT_REDIRECT 에러는 무시하고 진짜 에러만 toast로 보여줌
      if (error.message !== "NEXT_REDIRECT") {
        toast.error(error.message);
      }
    } finally {
      // 리다이렉트가 발생하면 페이지가 이동하므로 큰 의미는 없지만, 
      // 에러 발생 시 버튼 활성화를 위해 로딩을 꺼줍니다.
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (result?.error) toast.error(result.error);
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const result = await loginAsGuest();
      
      // 서버 액션이 리다이렉트되지 않고 에러 객체를 반환했을 때만 처리
      if (result && 'error' in result) {
        toast.error(result.error);
      }
    } catch (error: any) {
      // Next.js의 리다이렉트 에러는 무시하고, 진짜 에러만 토스트로 띄움
      if (error.message !== "NEXT_REDIRECT") {
        toast.error("An unexpected error occurred");
      }
    } finally {
      // 리다이렉트가 일어나면 어차피 페이지가 이동하므로 큰 상관 없지만, 
      // 에러 시에는 로딩을 꺼줘야 합니다.
      setIsLoading(false);
    }
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