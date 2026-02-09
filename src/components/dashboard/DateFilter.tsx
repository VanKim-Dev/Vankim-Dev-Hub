"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useLanguage } from "@/context/LanguageContext"; // ✅ 훅 추가
import { i18n } from "@/locales"; // ✅ 통합 번역 데이터 임포트

interface DateFilterProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: React.Dispatch<React.SetStateAction<{
    from: Date | undefined;
    to: Date | undefined;
  }>>;
}

export function DateFilter({ dateRange, setDateRange }: DateFilterProps) {
  // ✅ 전역 언어 상태 가져오기
  const { language } = useLanguage();
  const t = i18n[language];

  // 텍스트 정의 (번역 파일에 없다면 여기서 정의하거나 locales에 추가하세요)
  const labels = {
    title: language === "ko" ? "기간 필터" : "Date Filter",
    start: language === "ko" ? "시작일" : "Start Date",
    end: language === "ko" ? "종료일" : "End Date",
    reset: language === "ko" ? "이번 달 초기화" : "Reset to Monthly",
  };

  const handleReset = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    setDateRange({
      from: firstDay,
      to: now,
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 bg-card p-6 rounded-lg border shadow-sm">
      <h2 className="text-xl font-semibold">{labels.title}</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        {/* 시작일 */}
        <div className="w-full sm:flex-1 sm:min-w-[200px]">
          <Label htmlFor="start-date" className="text-sm text-muted-foreground mb-1 block">
            {labels.start}
          </Label>
          <Input
            id="start-date"
            type="date"
            value={dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
            onChange={(e) => {
              const value = e.target.value;
              setDateRange((prev) => ({
                ...prev,
                from: value ? new Date(value) : undefined,
              }));
            }}
            className="w-full"
          />
        </div>

        {/* 구분자 */}
        <div className="hidden sm:block text-muted-foreground pb-2">~</div>

        {/* 종료일 */}
        <div className="w-full sm:flex-1 sm:min-w-[200px]">
          <Label htmlFor="end-date" className="text-sm text-muted-foreground mb-1 block">
            {labels.end}
          </Label>
          <Input
            id="end-date"
            type="date"
            value={dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
            onChange={(e) => {
              const value = e.target.value;
              setDateRange((prev) => ({
                ...prev,
                to: value ? new Date(value) : undefined,
              }));
            }}
            className="w-full"
          />
        </div>

        {/* 초기화 버튼 */}
        <Button
          variant="outline"
          className="w-full sm:w-auto sm:min-w-[140px]"
          onClick={handleReset}
        >
          {labels.reset}
        </Button>
      </div>
    </div>
  );
}