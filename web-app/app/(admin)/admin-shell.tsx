"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  User,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/(auth)/login/actions";

interface AdminShellProps {
  children: React.ReactNode;
  user: any;
  profile: any;
}

export default function AdminShell({ children, user, profile }: AdminShellProps) {
  const pathname = usePathname();

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Admin User";
  const displayEmail = user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen bg-[#fff7e0] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-50 flex flex-col shadow-xl shadow-[#ff6933]/5 hidden lg:flex">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-50 bg-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 relative group-hover:scale-110 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/teacher-cat.png" alt="Dung Laoshi Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#ff6933] to-[#e65100] tracking-tight drop-shadow-sm group-hover:from-[#ff8a50] group-hover:to-[#ff6d00] transition-all">
                Dung Laoshi
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] -mt-0.5 group-hover:text-orange-400 transition-colors">Chinese Master</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard />} label="Tổng quan" active={pathname === "/dashboard"} />
          <NavItem href="/vocabulary" icon={<BookOpen />} label="Quản lý từ vựng" active={pathname.startsWith("/vocabulary")} />
          <NavItem href="/users" icon={<Users />} label="Người dùng" active={pathname.startsWith("/users")} />
          <NavItem href="/settings" icon={<Settings />} label="Cài đặt" active={pathname.startsWith("/settings")} />
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#ff6933] font-bold overflow-hidden">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#2E333D] truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2 lg:hidden">
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="w-6 h-6 text-[#2E333D]" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/teacher-cat.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-black text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#ff6933] to-[#e65100]">Dung Laoshi</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#ff6933]/10 flex items-center justify-center text-[#ff6933] font-bold overflow-hidden">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-[#2E333D]">{displayName}</p>
                    <p className="text-xs text-gray-500">Quản trị viên</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-bold truncate">{displayName}</span>
                    <span className="text-xs text-gray-400 font-normal truncate">{displayEmail}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ cá nhân</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer w-full flex items-center text-blue-600 focus:text-blue-700 focus:bg-blue-50">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>Về trang học tập</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6 w-full max-w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
        ? "bg-[#ff6933]/10 text-[#ff6933] font-bold"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium"
        }`}
    >
      <span className={`${active ? "text-[#ff6933]" : "text-gray-500 group-hover:text-[#ff6933]"} transition-colors`}>
        {icon}
      </span>
      <span className="text-base">{label}</span>
    </Link>
  )
}
