"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext"; // ✅ 추가
import { i18n } from "@/locales"; // ✅ 아까 합친 번역 데이터 사용 (index.ts에 있다면 i18n)

// Props 타입 정의 (lang은 이제 내부에서 가져오므로 제거해도 됩니다)
interface CategoryChartProps {
  chartData: {
    name: string;
    value: number;
  }[];
}

const COLORS = [
  "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", 
  "#C7CEEA", "#F3D1F4", "#B2E2F2", "#F9F9C5",
];

export function CategoryChart({ chartData }: CategoryChartProps) {
  // ✅ 전역 언어 상태 가져오기
  const { language } = useLanguage();
  const t = i18n[language]; // 현재 언어에 맞는 데이터셋

  // 번역 데이터 적용
  const chartTitle = t.chart.categoryDistribution;
  const noDataText = t.table.noData;
  const currencyUnit = language === "ko" ? "원" : "$"; // 혹은 t.common.unit

  return (
    <Card className="col-span-1 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{chartTitle}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="rgba(255,255,255,0.5)"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [
                  `${Number(value || 0).toLocaleString()}${currencyUnit}`, 
                  "" 
                ]} 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            {noDataText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}