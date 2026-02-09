// src/lib/supabase.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

// 1. 클라이언트를 생성하는 함수
export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase 환경변수가 로드되지 않았습니다. .env.local 확인");
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// 2. 실제 사용될 supabase 인스턴스를 직접 export (이 줄을 추가하세요!)
export const supabase = createClient();