"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext"; // ✅ 추가
import { i18n } from "@/locales"; // ✅ 추가

interface ScheduleCalendarProps {
  transactions: any[];
}

export function ScheduleCalendar({ transactions }: ScheduleCalendarProps) {
  // ✅ 전역 언어 상태 가져오기
  const { language } = useLanguage();
  const t = i18n[language];

  // 캘린더용 텍스트 정의 (locales에 추가 권장)
  const calendarTitle = language === "ko" ? "금융 달력" : "Financial Calendar";
  const noDesc = language === "ko" ? "내역 없음" : "No description";
  const todayLabel = language === "ko" ? "오늘" : "Today";

  // 1. 가계부 데이터를 캘린더 이벤트 형식으로 변환
  const events = transactions.map((tx) => ({
    id: tx.id,
    title: `${tx.type === "income" ? "+" : "-"}${Number(tx.amount).toLocaleString()}`,
    date: tx.date,
    backgroundColor: tx.type === "income" ? "#B5EAD7" : "#FFB7B2",
    borderColor: tx.type === "income" ? "#B5EAD7" : "#FFB7B2",
    textColor: "#333",
    extendedProps: { ...tx },
  }));

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{calendarTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            // ✅ locale={language} 하나로 요일(월/Mon), 월 이름 등이 자동 전환됩니다.
            locale={language} 
            events={events}
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            buttonText={{
              today: todayLabel,
            }}
            dateClick={(info) => console.log("clicked on " + info.dateStr)}
            eventClick={(info) => {
              // 툴팁이나 모달을 쓰지 않는 경우 간단한 번역 적용
              alert(`${info.event.extendedProps.description || noDesc}`);
            }}
          />
        </div>
        <style jsx global>{`
          .fc { font-family: inherit; }
          .fc-header-toolbar { margin-bottom: 1.5rem !important; font-size: 0.9rem; }
          .fc-daygrid-day-number { color: #666; text-decoration: none !important; padding: 4px !important; }
          .fc-event { cursor: pointer; border-radius: 4px; padding: 2px 4px; font-size: 0.75rem; font-weight: 600; }
          .fc-col-header-cell-cushion { color: #444; text-decoration: none !important; }
          .dark .fc-daygrid-day-number { color: #ccc; }
          .dark .fc-col-header-cell-cushion { color: #eee; }
          /* 캘린더 내부 텍스트 크기 조절 */
          .fc-toolbar-title { font-size: 1.1rem !important; font-weight: bold; }
        `}</style>
      </CardContent>
    </Card>
  );
}