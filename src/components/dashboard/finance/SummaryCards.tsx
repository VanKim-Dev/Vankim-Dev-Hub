"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // ✅ 추가
import { i18n } from "@/locales"; // ✅ 추가

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function SummaryCards({ 
  totalIncome, 
  totalExpense, 
  balance,
}: SummaryCardsProps) {
  // ✅ 전역 언어 상태 및 번역 데이터 가져오기
  const { language } = useLanguage();
  const t = i18n[language];

  // 화폐 단위 설정 (한국어일 땐 '원', 영어일 땐 '$')
  const unit = language === "ko" ? "원" : "$";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 총 수입 카드 */}
      <Card className="border-l-4 border-l-green-500 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-tight">
            {t.dashboard.totalIncome}
          </CardTitle>
          <TrendingUp className="w-4 h-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-black text-green-600">
            {language === "en" && "$"}
            {totalIncome.toLocaleString()}
            {language === "ko" && " 원"}
          </p>
        </CardContent>
      </Card>

      {/* 총 지출 카드 */}
      <Card className="border-l-4 border-l-red-500 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-tight">
            {t.dashboard.totalExpense}
          </CardTitle>
          <TrendingDown className="w-4 h-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-black text-red-600">
            {language === "en" && "$"}
            {totalExpense.toLocaleString()}
            {language === "ko" && " 원"}
          </p>
        </CardContent>
      </Card>

      {/* 잔액 카드 */}
      <Card className="border-l-4 border-l-blue-500 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-tight">
            {t.dashboard.balance}
          </CardTitle>
          <Wallet className="w-4 h-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className={`text-3xl font-black ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
            {language === "en" && "$"}
            {balance.toLocaleString()}
            {language === "ko" && " 원"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}