import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* 데스크톱 사이드바: md(768px) 이상에서만 노출 */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* 모바일 헤더: md 이상에서는 숨김 */}
        <div className="md:hidden sticky top-0 z-40 bg-white dark:bg-slate-950 border-b p-4">
          <MobileNav />
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}