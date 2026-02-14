"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// 1. 차트 데이터 아이템 타입 정의
interface ChartDataItem {
  time: string;
  price: number;
}

// 2. 컴포넌트 프롭 타입 정의 (부모로부터 data를 받지 않는다면 비워둬도 됩니다)
interface CryptoPriceChartProps {
  data?: ChartDataItem[]; // 선택적 프롭으로 변경
}

export default function CryptoPriceChart({ data: propData }: CryptoPriceChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 만약 부모로부터 전달받은 data(propData)가 있다면 API를 호출하지 않음
    if (propData && propData.length > 0) {
      setChartData(propData);
      setIsLoading(false);
      return;
    }

    const fetchChartData = async () => {
      try {
        const res = await fetch("/api/crypto/chart");
        const result = await res.json();
        
        if (Array.isArray(result)) {
          setChartData(result);
        }
      } catch (error) {
        console.error("차트 데이터를 불러오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, [propData]);

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full rounded-xl mt-4" />;
  }

  if (chartData.length === 0) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground border border-dashed rounded-xl mt-4">
        시세 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] mt-4"> 
        <ResponsiveContainer width="100%" height="100%">
        {/* 💡 핵심: props로 넘어온 data가 아닌, state인 chartData를 사용합니다. */}
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fill: '#9ca3af'}} 
            minTickGap={30}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#22c55e" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}