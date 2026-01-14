"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Trophy, Star, BookOpen } from "lucide-react"

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
  const searchParams = useSearchParams()
  const currentLevelStr = searchParams.get("level")
  const currentLevel = currentLevelStr ? parseInt(currentLevelStr) : 1

  const currentLevelStat = stats.find(s => s.level === currentLevel)

  return (
    <div className="w-full space-y-6 sticky top-24">
      {/* Current Level Stats */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
        <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#ff6933]" />
          Thống kê HSK {currentLevel}
        </h3>

        {currentLevelStat ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Chưa biết</span>
              <span className="font-bold text-gray-900">{currentLevelStat.new}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-500 font-medium">Chưa thuộc</span>
              <span className="font-bold text-blue-600">{currentLevelStat.learning}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-500 font-medium">Đã thuộc</span>
              <span className="font-bold text-green-600">{currentLevelStat.mastered}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">Chọn cấp độ để xem thống kê</p>
        )}
      </div>

      {/* Total Stats Card */}
      <div className="bg-[#fff7ed] rounded-3xl p-6 border border-orange-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-amber-500">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase mb-0.5">TỔNG TỪ VỰNG</p>
            <p className="text-3xl font-black text-gray-900 leading-none">
              {stats.reduce((acc, curr) => acc + curr.mastered, 0)}
            </p>
            <p className="text-[10px] text-amber-700 font-medium mt-1">
              Trên tổng số {stats.reduce((acc, curr) => acc + curr.total, 0)} từ
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
