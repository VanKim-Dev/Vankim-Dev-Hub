"use client"; // useLanguage를 쓰기 위해 클라이언트 컴포넌트로 변경

import { Suspense } from "react";
// Metadata는 서버 컴포넌트 전용이므로, 클라이언트 컴포넌트에서는 삭제하거나 
// 별도의 layout.tsx로 옮겨야 합니다.
import { 
  TrendingUp, 
  Newspaper, 
  Activity 
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import CryptoHeader from "@/components/dashboard/crypto/CryptoHeader";
import CryptoPriceChart from "@/components/dashboard/crypto/CryptoPriceChart";
import CryptoSummaryCards from "@/components/dashboard/crypto/CryptoSummaryCards";
import CryptoTable from "@/components/dashboard/crypto/CryptoTable";
import NewsFeed from "@/components/dashboard/crypto/NewsFeed";

// 언어 컨텍스트 임포트
import { useLanguage } from "@/context/LanguageContext";
import { i18n } from "@/locales";

export default function CryptoPage() {
  const { language } = useLanguage();
  const t = i18n[language];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* 1. Header Section */}
      <CryptoHeader 
        title={t.crypto.title} 
        description={t.crypto.description}
      />

      {/* 2. Summary Cards */}
      <Suspense fallback={<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Skeleton className="h-32" /></div>}>
        <CryptoSummaryCards />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* 3. Main Chart */}
        <div className="col-span-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6">
              <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                {t.crypto.marketTrend}
              </h3>
            </div>
            <div className="p-6 pt-0">
              <CryptoPriceChart />
            </div>
          </div>
        </div>

        {/* 4. News Feed */}
        <div className="col-span-3">
          <div className="rounded-xl border bg-card text-card-foreground shadow h-full">
            <div className="p-6">
              <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                < Newspaper className="h-4 w-4 text-primary" />
                {t.crypto.latestNews}
              </h3>
            </div>
            <div className="p-6 pt-0">
              <NewsFeed />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Crypto Table */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            {t.crypto.topAssets}
          </h3>
        </div>
        <div className="p-6 pt-0">
          <CryptoTable />
        </div>
      </div>
    </div>
  );
}