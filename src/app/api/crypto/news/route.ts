import { NextResponse } from "next/server";

export async function GET() {
  // 1. 키값 확인 (없으면 에러 방지를 위해 하드코딩된 값이라도 넣거나 경고 출력)
  const API_KEY = process.env.CRYPTO_PANIC_API_KEY;
  const BASE_URL = "https://cryptopanic.com/api/developer/v2/posts/";

  try {
    const res = await fetch(
      `${BASE_URL}?auth_token=${API_KEY}&public=true&kind=news`,
      { 
        next: { revalidate: 3600 },
        headers: { "Content-Type": "application/json" }
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: `CryptoPanic API Status: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();

    // 2. 데이터 구조 안전 검사 (results가 없을 경우 대비)
    if (!data || !data.results || !Array.isArray(data.results)) {
      console.error("Unexpected API structure:", data);
      return NextResponse.json([]); // 빈 배열 반환해서 클라이언트 에러 방지
    }

    // 3. 데이터 가공 (Optional Chaining ?. 사용으로 에러 방지)
    const formattedNews = data.results.map((post: any) => {
        // 1. 우선순위대로 주소 찾기
        let link = post.url || post.original_url;

        // 2. 주소가 아예 없다면? 크립토패닉 뉴스 상세페이지(id 기반)로 강제 생성
        if (!link && post.id) {
            link = `https://cryptopanic.com/news/${post.id}/`;
        }

        // 3. id도 없다면? 구글에서 해당 제목으로 뉴스 검색하도록 링크 생성
        if (!link || link === "#") {
            const encodedTitle = encodeURIComponent(post.title || "crypto news");
            link = `https://www.google.com/search?q=${encodedTitle}&tbm=nws`;
        }

        // 4. 상대 경로(/news/123)로 올 경우 도메인 붙여주기
        if (link.startsWith('/')) {
            link = `https://cryptopanic.com${link}`;
        }

        return {
            id: post.id || Math.random().toString(),
            title: post.title || "No Title",
            source: post.source?.title || post.domain || "Crypto News",
            time: formatTime(post.published_at),
            url: link, // 👈 이제 무조건 클릭 가능한 주소가 들어갑니다!
        };
    }).slice(0, 5);

    return NextResponse.json(formattedNews);

  } catch (error: any) {
    console.error("News Route Error Detail:", error.message);
    return NextResponse.json({ error: "Server Catch Error", message: error.message }, { status: 500 });
  }
}

// 시간 계산 함수
function formatTime(dateString: string) {
  if (!dateString) return "Recently";
  const now = new Date();
  const published = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
  
  if (isNaN(diffInHours)) return "Recently";
  if (diffInHours < 1) return "Just now";
  if (diffInHours > 24) return `${Math.floor(diffInHours / 24)}d ago`;
  return `${diffInHours}h ago`;
}