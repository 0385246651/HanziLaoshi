"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Bolt, Zap, Book, RotateCw, Crown } from "lucide-react"
import confetti from "canvas-confetti"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LevelStats {
  level: number
  total: number
  mastered: number
  learning: number
  new: number
}

interface StatsSidebarProps {
  stats: LevelStats[]
}

export function StatsSidebar({ stats }: StatsSidebarProps) {
  const [showReward, setShowReward] = useState(false)
  const totalMastered = stats.reduce((acc, curr) => acc + curr.mastered, 0)
  const totalNew = stats.reduce((acc, curr) => acc + curr.new, 0)

  // Mock daily progress
  const dailyTarget = 25
  const dailyProgress = 30
  const isGoalMet = dailyProgress >= dailyTarget

  useEffect(() => {
    if (showReward) {
      // 1. Play Applause Sound
      const audio = new Audio("/sounds/applause.mp3")
      audio.volume = 0.6
      audio.play().catch(e => console.error("Audio play failed", e))

      // 2. Confetti Effect (Party Popper from center)
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        // launch a few confetti from the left edge
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ffc629', '#e7564a', '#ffffff']
        });
        // and launch a few from the right edge
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ffc629', '#e7564a', '#ffffff']
        });

        // Center burst
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      // Initial burst
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ffc629', '#e7564a', '#ffffff'],
        disableForReducedMotion: true
      });

      frame();
    }
  }, [showReward])

  return (
    <aside className="w-full flex-col gap-6 shrink-0 h-fit sticky top-24">
      {/* Daily Goal Widget */}
      <div className="rounded-2xl p-5 border border-[#f0ebe0] bg-white shadow-sm flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-[#1d180c]">Mục tiêu ngày</h3>
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-lg transition-colors",
            isGoalMet ? "bg-[#fff8e1] text-[#ffc629]" : "bg-gray-100 text-gray-500"
          )}>
            {dailyProgress}/{dailyTarget} XP
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-[#f4f0e6]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
              <path
                className={cn("transition-all duration-1000 ease-out", isGoalMet ? "text-[#ffc629]" : "text-gray-300")}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${(dailyProgress / dailyTarget) * 100}, 100`}
                strokeLinecap="round"
                strokeWidth="4"
              ></path>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Bolt className={cn("w-6 h-6 fill-current", isGoalMet ? "text-[#ffc629]" : "text-gray-300")} />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-[#6b5c35] leading-tight mb-1">
              {isGoalMet ? "Tuyệt vời! Bạn đã hoàn thành mục tiêu." : "Cố lên, bạn sắp hoàn thành rồi!"}
            </p>
            <button
              onClick={() => isGoalMet && setShowReward(true)}
              disabled={!isGoalMet}
              className={cn(
                "text-xs font-bold text-left transition-colors",
                isGoalMet
                  ? "text-[#e7564a] hover:underline cursor-pointer animate-pulse"
                  : "text-gray-400 cursor-not-allowed"
              )}
            >
              {isGoalMet ? "Nhận thưởng ngay" : "Tiếp tục học"}
            </button>
          </div>
        </div>
      </div>

      {/* Vocabulary Widget */}
      <div className="rounded-2xl p-5 border border-[#f0ebe0] bg-[#fcfbf8] shadow-sm flex flex-col gap-4">
        <h3 className="font-bold text-[#1d180c] flex items-center gap-2">
          <Book className="w-5 h-5 text-[#6b5c35]" />
          Kho từ vựng
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#ecfdf5] border border-[#d1fae5] flex flex-col items-center justify-center gap-1">
            <span className="text-2xl font-bold text-[#3c8c70]">{totalMastered}</span>
            <span className="text-xs font-medium text-[#047857]">Đã nhớ</span>
          </div>
          <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fee2e2] flex flex-col items-center justify-center gap-1">
            <span className="text-2xl font-bold text-[#e7564a]">{totalNew}</span>
            <span className="text-xs font-medium text-[#b91c1c]">Chưa biết</span>
          </div>
        </div>
        <Link
          href="/review"
          className="w-full py-2.5 rounded-xl border border-[#ebe5d5] bg-white text-sm font-bold text-[#6b5c35] hover:bg-[#f4f0e6] transition-colors flex items-center justify-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Ôn tập từ vựng
        </Link>
      </div>

      {/* Reward Dialog */}
      <Dialog open={showReward} onOpenChange={setShowReward}>
        <DialogContent className="sm:max-w-md bg-white border-orange-100 shadow-2xl overflow-hidden p-0 rounded-3xl">
          <div className="relative flex flex-col items-center text-center p-8 pt-12 pb-8">
            {/* Background Rays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-50 via-white to-white z-0"></div>

            {/* Confetti/Decor */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/0 to-white/0 z-10 pointer-events-none"></div>

            {/* Cat Emperor Image */}
            <div className="relative z-10 w-64 h-64 -mt-6 mb-4 animate-in zoom-in-50 duration-500 ease-out-back">
              <img
                src="/cat-emperor-reward.png"
                alt="Cat Emperor Gift"
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>

            <div className="relative z-10 space-y-3 w-full">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-[#e7564a]">
                  Hoàng Thượng Ban Thưởng!
                </DialogTitle>
                <DialogDescription className="text-[#6b5c35] font-medium text-base">
                  Chúc mừng bạn đã hoàn thành mục tiêu ngày.<br />
                  Hãy nhận lấy phần thưởng xứng đáng này!
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center justify-center gap-2 py-4">
                <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#ffc629] fill-current" />
                  <span className="font-bold text-[#1d180c]">+50 XP</span>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#ffc629] fill-current" />
                  <span className="font-bold text-[#1d180c]">+1 Gem</span>
                </div>
              </div>

              <button
                onClick={() => setShowReward(false)}
                className="w-full py-3 rounded-xl bg-[#ffc629] hover:bg-[#ffcf4d] text-[#1d180c] font-bold shadow-lg shadow-orange-200 transition-transform active:scale-95"
              >
                Đa tạ Hoàng Thượng!
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
