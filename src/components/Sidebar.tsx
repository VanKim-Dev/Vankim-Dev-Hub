// components/Sidebar.tsx
import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex-col sticky top-0 transition-colors duration-300">
      <SidebarContent />
    </aside>
  );
}