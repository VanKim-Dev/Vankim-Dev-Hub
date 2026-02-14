export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7",
      { 
        next: { revalidate: 3600 },
        headers: { "Content-Type": "application/json" }
      }
    );

    // 호출 제한에 걸렸을 경우(429) 예외 발생
    if (res.status === 429) throw new Error("Rate limit exceeded");

    const data = await res.json();

    const formattedData = data.prices.map((item: [number, number]) => ({
      time: new Date(item[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Math.floor(item[1]),
    })).slice(-24);

    return Response.json(formattedData);
  } catch (error) {
    console.error("API Fetch Error:", error);
    
    // 💡 API가 실패했을 때 보여줄 예시 데이터 (테스트용)
    const fallbackData = [
      { time: "08:00", price: 42000 },
      { time: "12:00", price: 43500 },
      { time: "16:00", price: 42800 },
      { time: "20:00", price: 44200 },
      { time: "00:00", price: 43900 },
      { time: "04:00", price: 45000 },
    ];
    
    return Response.json(fallbackData);
  }
}