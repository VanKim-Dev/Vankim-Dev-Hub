"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ko } from "@/locales/ko";

export default function CryptoSummaryCards() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    fetch("/api/crypto")
      .then((res) => {
        if (res.status === 429) {
          setIsRateLimited(true);
          throw new Error("Rate limit exceeded");
        }
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((json) => {
        // API Route에서 가공된 배열의 첫 번째(Bitcoin)를 선택
        if (Array.isArray(json) && json.length > 0) {
          setData(json[0]);
          setIsRateLimited(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Card data fetch error:", err);
        setLoading(false);
      });
  }, []);

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // API 호출 제한(429) 시 표시할 안내 문구
    if (isRateLimited) {
        return (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
            <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
                <div className="flex items-start gap-2 text-amber-800">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                    {/* 💡 한글 번역 적용 */}
                    <p className="font-bold text-sm">{ko.crypto.updating}</p>
                    <p className="text-xs mt-1 opacity-80">
                    {ko.crypto.rate_limit_msg}
                    </p>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {/* 💡 한글 번역 적용 */}
            <CardTitle className="text-sm font-medium">{ko.crypto.chartTitle}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {/* 데이터가 없을 경우를 대비한 안전한 렌더링 */}
            ${data?.price ? data.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "---"}
          </div>
          <p className={`text-xs font-medium mt-1 ${data?.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {data?.change >= 0 ? '▲' : '▼'} {Math.abs(data?.change || 0).toFixed(2)}%
            <span className="text-muted-foreground ml-1 font-normal text-[10px]">from yesterday</span>
          </p>
        </CardContent>
      </Card>

      {/* 추가 카드가 필요하면 여기에 배치 (ETH, SOL 등) */}
    </div>
  );
}