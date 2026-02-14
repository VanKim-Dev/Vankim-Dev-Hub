"use client";
import { useEffect, useState } from "react";

export default function TopAssets() {
  // 💡 초기값을 확실히 빈 배열로 설정합니다.
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch("/api/crypto");
        
        // 응답이 정상이 아니면 에러를 던집니다.
        if (!res.ok) throw new Error('Network response was not ok');
        
        const data = await res.json();
        
        // 💡 중요: 받은 데이터가 실제로 배열인지 확인 후 저장합니다.
        if (Array.isArray(data)) {
          setAssets(data);
          setError(false);
        } else {
          // 서버에서 { error: "..." } 같은 객체를 보낸 경우 처리
          console.error("Data is not an array:", data);
          setAssets([]);
          setError(true);
        }
      } catch (error) {
        console.error("Failed to fetch assets", error);
        setAssets([]); // 에러 발생 시 빈 배열로 초기화하여 .map 에러 방지
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
    const timer = setInterval(fetchAssets, 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">가격을 동기화 중입니다...</div>;
  
  // 에러 발생 시 UI 처리
  if (error) return <div className="p-8 text-center text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-gray-400 text-sm">
            <th className="py-4 font-medium">Name</th>
            <th className="py-4 font-medium text-right">Price</th>
            <th className="py-4 font-medium text-right">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {/* 💡 assets가 배열일 때만 map을 실행합니다. (Optional Chaining 사용) */}
          {assets?.map((asset: any) => (
            <tr key={asset.id} className="border-b border-gray-50 dark:border-gray-800 last:border-none hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="py-4">
                    <div className="flex items-center gap-3">
                    <img src={asset.icon} alt={asset.name} className="w-6 h-6 rounded-full" />
                    <div>
                        {/* text-gray-900을 text-foreground로 변경하거나 dark:text-white 추가 */}
                        <span className="font-bold text-gray-900 dark:text-gray-100 block leading-none">{asset.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase">{asset.symbol}</span>
                    </div>
                    </div>
                </td>
                {/* 가격 텍스트 색상 수정 */}
                <td className="py-4 text-right font-semibold text-gray-900 dark:text-gray-100">
                    ${asset.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                {/* 변동률은 green/red라 잘 보이지만, 채도를 살짝 조정하면 더 좋습니다 */}
                <td className={`py-4 text-right font-medium ${asset.change >= 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                    {asset.change >= 0 ? "+" : ""}{asset.change?.toFixed(2)}%
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}