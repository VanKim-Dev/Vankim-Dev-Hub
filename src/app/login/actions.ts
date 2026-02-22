// app/login/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // redirect 대신 에러 객체를 리턴하여 클라이언트가 알 수 있게 합니다.
    return { error: error.message };
  }

  // 성공 시에만 리다이렉트
  redirect('/finance');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // 가입 성공 (이메일 인증이 설정된 경우 리다이렉트나 성공 메시지 반환)
  return { success: true };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  
  // 서버 측에서 OAuth 링크 생성
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // 배포 환경과 로컬 환경에 맞게 자동으로 Origin을 잡도록 설정
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) return { error: error.message };
  if (data.url) redirect(data.url); // 구글 로그인 페이지로 이동
}

export async function loginAsGuest() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: "guest@example.com",
    password: "guestpassword123!",
  });

  if (error) {
    return { error: "Guest login failed." };
  }

  // 에러가 없으면 redirect 실행 (객체를 리턴하지 않음)
  redirect('/finance');
}
