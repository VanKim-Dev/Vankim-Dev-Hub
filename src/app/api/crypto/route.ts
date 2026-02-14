// src/app/api/crypto/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc",
      { 
        next: { revalidate: 60 } // 💡 60초 동안은 API를 다시 찌르지 않고 저장된 값을 씁니다.
      }
    );

    if (!res.ok) {
      // 외부 API(CoinGecko) 자체가 에러를 낼 경우를 대비
      return NextResponse.json({ error: "External API Error" }, { status: res.status });
    }

    const data = await res.json();

    // 데이터가 비어있을 경우 예외 처리
    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    const formatted = data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change: coin.price_change_percentage_24h,
      icon: coin.image,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("API ROUTE ERROR:", error); // 터미널 로그 확인용
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}