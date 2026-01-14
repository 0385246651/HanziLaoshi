import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getUserStats } from "@/app/(user)/learn/actions";
import { ConquestRoadmap } from "@/components/learn/ConquestRoadmap";
import { StatsSidebar } from "@/components/learn/StatsSidebar";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  GraduationCap,
  LayoutList,
  Swords
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UserHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch real stats for the sidebars
  const stats = await getUserStats();

  const userData = {
    full_name: user?.user_metadata?.full_name || "Bạn",
    // We can infer current level from stats basically by finding the first level not masked (simplification)
    // For now defaulting to 1 or whatever query param URL might have, but dashboard usually implies 'current progress'
    hsk_level: 1,
  }

  return (
    <div className="min-h-screen bg-gray-50/50 -m-4 md:-m-8 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Conquest Roadmap */}
        <div className="lg:col-span-3 xl:col-span-2 hidden lg:block">
          <ConquestRoadmap stats={stats} />
        </div>

        {/* Center Column: Main Content */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col min-w-0 space-y-8">

          {/* Hero Section */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10">
              <h1 className="text-3xl font-black text-[#1d1a0c] mb-2 font-display flex items-center gap-2">
                <span className="text-4xl">👋</span> Nǐ hǎo, <span className="text-[#ff6933] bg-clip-text text-transparent bg-gradient-to-r from-[#ff6933] to-[#e65100]">{userData.full_name}</span>!
              </h1>
              <p className="text-gray-500 text-lg mb-6 max-w-xl">
                Hôm nay là một ngày tuyệt vời để tu luyện thêm bí kíp mới. Sẵn sàng chinh phục HSK {userData.hsk_level} chưa?
              </p>

              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#ff6933] hover:bg-[#e55022] text-white shadow-lg shadow-orange-200 h-12 px-8 rounded-xl text-lg font-bold transition-all hover:scale-105 active:scale-95" asChild>
                  <Link href="/learn">
                    Tiếp tục tu luyện <Swords className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Quick Access Grid */}
          <section>
            <h2 className="text-xl font-black text-[#1d1a0c] mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span> Khám phá nhanh
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <QuickAccessCard
                href="/learn"
                title="Bí kíp Từ vựng"
                description="Tra cứu và học từ vựng theo lộ trình."
                icon={<BookOpen className="w-6 h-6 text-blue-500" />}
                color="bg-blue-50 border-blue-100 hover:border-blue-200"
              />

              <QuickAccessCard
                href="/review"
                title="Ôn tập Flashcard"
                description="Luyện tập ghi nhớ với Flashcard thông minh."
                icon={<LayoutList className="w-6 h-6 text-purple-500" />}
                color="bg-purple-50 border-purple-100 hover:border-purple-200"
              />

              <QuickAccessCard
                href="/games"
                title="Đấu trường Game"
                description="Vừa chơi vừa học với các mini-game thú vị."
                icon={<Gamepad2 className="w-6 h-6 text-green-500" />}
                color="bg-green-50 border-green-100 hover:border-green-200"
              />

              <QuickAccessCard
                href="/tests"
                title="Thí luyện trường"
                description="Làm bài test mô phỏng đề thi thực tế."
                icon={<GraduationCap className="w-6 h-6 text-orange-500" />}
                color="bg-orange-50 border-orange-100 hover:border-orange-200"
                isComingSoon
              />

            </div>
          </section>
        </div>

        {/* Right Column: Stats Sidebar */}
        <div className="lg:col-span-3 hidden lg:block">
          <StatsSidebar stats={stats} />
        </div>

      </div>
    </div>
  );
}

function QuickAccessCard({ href, title, description, icon, color, isComingSoon }: any) {
  const CardContent = (
    <div className={`
      p-6 rounded-2xl border-2 transition-all duration-200 h-full flex flex-col justify-between group
      ${color} ${isComingSoon ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-lg cursor-pointer"}
    `}>
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
          {isComingSoon && (
            <span className="px-2 py-1 bg-white/50 border border-white text-gray-500 text-[10px] font-bold uppercase rounded-full">
              Sắp ra mắt
            </span>
          )}
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )

  if (isComingSoon) {
    return CardContent
  }

  return <Link href={href}>{CardContent}</Link>
}
