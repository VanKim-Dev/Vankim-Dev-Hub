"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportPDF } from "./ReportPDF";
import { Button } from "@/components/ui/button";
import { Loader2, FileDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // ✅ 훅 추가
import { i18n } from "@/locales"; // ✅ 통합 번역 데이터

export function ReportDownload({ transactions, summary, dateRange }: any) {
  const [isMounted, setIsMounted] = useState(false);
  
  // ✅ 전역 언어 상태 가져오기
  const { language } = useLanguage();
  const t = i18n[language];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // ✅ 파일명도 언어 설정에 따라 동적으로 생성 (예: 재무_보고서.pdf / Finance_Report.pdf)
  // t.pdf.title이 없다면 t.sidebar.finance 등을 활용해도 좋습니다.
  const fileName = `${(t as any).pdf?.title || "Report"}.pdf`.replace(/\s/g, "_");

  return (
    <div className="w-full sm:w-auto inline-block">
      <PDFDownloadLink
        document={
          <ReportPDF 
            data={transactions} 
            summary={summary} 
            dateRange={dateRange} 
            lang={language} // ✅ PDF 생성기는 내부 폰트 처리 등을 위해 lang 값이 필요할 수 있으므로 전달
          />
        }
        fileName={fileName}
      >
        {({ loading }) => (
          <Button 
          variant="outline" 
          disabled={loading} 
          className="w-full sm:w-auto gap-2 transition-all text-xs md:text-sm h-9 md:h-10" // 너비와 폰트 크기 조절
        >
            {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="truncate">{(t as any).common?.processing || "..."}</span>
            </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span className="truncate">{t.dashboard.reportDownload || "Download PDF"}</span>
              </>
            )}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
}