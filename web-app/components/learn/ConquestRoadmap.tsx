"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Swords, Star, Lock, Map } from "lucide-react"

interface LevelStats {
  level: number
  total: number
  mastered: number
  learning: number
  new: number
}

interface ConquestRoadmapProps {
  stats: LevelStats[]
}

export function ConquestRoadmap({ stats }: ConquestRoadmapProps) {
  const searchParams = useSearchParams()
  const currentLevelStr = searchParams.get("level")
  // If on home page, searchParams might be empty. Default to finding the first level with remaining content or just 1.
  // Ideally this component highlights the *active* level.
  const currentLevel = currentLevelStr ? parseInt(currentLevelStr) : 1

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-orange-100 relative overflow-hidden h-fit sticky top-24">
      {/* Decor Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full opacity-50 -mr-10 -mt-10 pointer-events-none"></div>

      <h3 className="font-black text-xl mb-8 flex items-center gap-3 text-[#1d1a0c] relative z-10 uppercase tracking-wide">
        <Map className="w-6 h-6 text-[#ff6933]" />
        Lộ Trình
      </h3>

      <div className="relative pl-4 space-y-0">
        {/* Continuous Vertical Line */}
        <div className="absolute left-[27px] top-4 bottom-10 w-1 bg-gradient-to-b from-orange-200 via-orange-100 to-gray-100 rounded-full -z-0"></div>

        {stats.map((stat) => {
          const progress = stat.total > 0 ? (stat.mastered / stat.total) * 100 : 0
          const isActive = currentLevel === stat.level
          const isMastered = progress === 100

          return (
            <div key={stat.level} className="relative pb-8 last:pb-0 z-10">
              <Link
                href={`/learn?level=${stat.level}`}
                className={cn(
                  "flex items-start gap-4 group transition-all duration-300",
                  isActive ? "scale-105" : "hover:scale-102"
                )}
              >
                {/* Milestone Marker */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-md transition-all z-20 shrink-0 bg-white",
                  isActive
                    ? "border-orange-400 text-[#ff6933] ring-4 ring-orange-100 shadow-orange-200"
                    : isMastered
                      ? "border-green-500 text-green-500"
                      : "border-gray-200 text-gray-400 hover:border-orange-300"
                )}>
                  {isActive ? (
                    <Swords className="w-5 h-5 animate-pulse" />
                  ) : isMastered ? (
                    <Star className="w-5 h-5 fill-current" />
                  ) : (
                    <span className="font-black text-sm text-gray-500">{stat.level}</span>
                  )}
                </div>

                {/* Level Info */}
                <div className={cn(
                  "flex-1 p-3 rounded-xl border-2 transition-all shadow-sm relative",
                  isActive
                    ? "bg-gradient-to-br from-[#fff7ed] to-white border-[#ff6933] shadow-lg shadow-orange-100"
                    : "bg-white border-gray-100 hover:border-orange-200 hover:shadow-md"
                )}>
                  {isActive && (
                    <img
                      src="/teacher-cat.png"
                      alt="Teacher"
                      className="absolute -top-5 -right-3 w-12 h-12 object-contain drop-shadow-md z-30 transform rotate-12"
                    />
                  )}

                  <div className="flex justify-between items-center mb-1">
                    <h4 className={cn(
                      "font-black text-sm uppercase",
                      isActive ? "text-[#ff6933]" : "text-gray-700"
                    )}>
                      Cảnh giới {stat.level}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <Progress
                      value={progress}
                      className="h-1.5 bg-gray-100"
                      indicatorClassName={cn(isActive ? "bg-[#ff6933]" : "bg-green-500")}
                    />
                    <span className="text-[10px] font-bold text-gray-400 min-w-[2rem] text-right">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {stat.mastered}/{stat.total} bí kíp
                  </p>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
