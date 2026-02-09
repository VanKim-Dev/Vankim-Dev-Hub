"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// 지원하는 언어 타입 정의
type Language = "ko" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // 초기값은 한국어(ko)로 설정
  const [language, setLanguage] = useState<Language>("ko");

  // 브라우저 첫 접속 시 사용자 언어 감지 (선택 사항)
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      const browserLang = window.navigator.language.split("-")[0];
      if (browserLang === "ko" || browserLang === "en") {
        setLanguage(browserLang);
      }
    }
  }, []);

  // 언어 변경 시 로컬 스토리지에 저장하여 새로고침해도 유지
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const toggleLanguage = () => {
    const newLang = language === "ko" ? "en" : "ko";
    handleSetLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 다른 컴포넌트에서 쉽게 꺼내 쓸 수 있는 커스텀 훅
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};