import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props // 여기서 나머지 속성들을 props 객체로 모읍니다.
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props} // 반드시 중괄호 안에 점 3개와 함께 작성해야 합니다.
    />
  )
}

export { Skeleton }