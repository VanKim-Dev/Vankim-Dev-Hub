"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext"; // ✅ 추가
import { i18n } from "@/locales"; // ✅ 추가

interface MonthlyChartProps {
  data: any[]; // 전체 거래 내역
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  // ✅ 전역 언어 상태 및 번역 데이터 가져오기
  const { language } = useLanguage();
  const t = i18n[language];
  
  const chartTitle = t.chart.monthlyTrend;

  // 데이터가 없을 때 표시할 UI
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-2 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold">{chartTitle}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          {t.table.noData}
        </CardContent>
      </Card>
    );
  }

  // 1. 데이터 가공: 날짜별로 수입과 지출을 합산
  const chartData = data.reduce((acc: any[], curr) => {
    const date = curr.date;
    const existing = acc.find((item) => item.date === date);

    if (existing) {
      if (curr.type === "income") existing.income += Number(curr.amount);
      else existing.expense += Number(curr.amount);
    } else {
      acc.push({
        date,
        income: curr.type === "income" ? Number(curr.amount) : 0,
        expense: curr.type === "expense" ? Number(curr.amount) : 0,
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="col-span-2 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{chartTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B5EAD7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#B5EAD7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFB7B2" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFB7B2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
              <XAxis 
                dataKey="date" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(str) => str.split('-').slice(1).join('/')}
              />
              <YAxis 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `${val.toLocaleString()}`} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                formatter={(value: any, name: any) => {
                  const formattedValue = value != null ? Number(value).toLocaleString() : "0";
                  
                  // 번역 파일(t.chart)에서 수입/지출 이름을 가져옵니다.
                  const labelName = name === "income" ? t.chart.income : 
                                   name === "expense" ? t.chart.expense : 
                                   name || "";
                  
                  // 화폐 단위 설정 (원 또는 $)
                  const unit = language === "ko" ? "원" : "$";
                  
                  return [
                    `${formattedValue} ${unit}`, 
                    labelName
                  ];
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#B5EAD7"
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#FFB7B2"
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}