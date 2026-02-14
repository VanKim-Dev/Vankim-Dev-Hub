"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  url: string;
}

export default function NewsFeed() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/crypto/news");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // 🔎 로그 추가: 가져온 데이터의 URL들이 정상인지 확인합니다.
          console.log("📍 가공된 뉴스 데이터:", data);
          setNewsList(data);
        }
      } catch (error) {
        console.error("News fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (isLoading) return <div className="space-y-4">{/* 스켈레톤 로직 */}</div>;

  return (
    <div className="space-y-4">
      {newsList.map((item, index) => (
        <motion.a
          key={`news-${item.id}-${index}`}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          // 🔎 클릭 시 로그 추가: 실제 어떤 URL로 이동하려고 하는지 출력
          onClick={(e) => {
            console.log(`🔗 이동 시도 URL (${item.source}):`, item.url);
            // 만약 URL이 "#" 이거나 잘못되었다면 알림
            if (!item.url || item.url === "#") {
              console.error("❌ 잘못된 URL입니다!");
            }
          }}
          className="flex flex-col space-y-1.5 border-b pb-3 last:border-0 group cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2 text-left">
              {item.title}
            </span>
            <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-0.5" />
          </div>
          <div className="flex items-center text-[11px] text-muted-foreground uppercase tracking-wider">
            <span className="font-bold text-primary/80">{item.source}</span>
            <span className="mx-1.5">•</span>
            <span>{item.time}</span>
          </div>
        </motion.a>
      ))}
    </div>
  );
}