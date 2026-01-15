"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Swords, Star, Lock, Map, Check, Play } from "lucide-react"

interface LevelStats {
  level: number
  total: number
  mastered: number
  learning: number
  new: number
}

interface ConquestRoadmapProps {
  stats: LevelStats[]
  mode?: "sidebar" | "full"
}

export function ConquestRoadmap({ stats, mode = "sidebar" }: ConquestRoadmapProps) {
  const searchParams = useSearchParams()
  const currentLevelStr = searchParams.get("level")
  const currentLevel = currentLevelStr ? parseInt(currentLevelStr) : 3 // Mock active level 3 as per design if not found, or logic:

  // If we are in "full" mode (Home page), we might want to highlight the user's actual current level. 
  // For now let's assume the passed 'currentLevel' via searchParams logic is fine, or we default to the first non-mastered level.
  // Realistically, the parent should pass 'currentLevel', but for now we deduce it.

  if (mode === "sidebar") {
    // Original Sidebar Implementation
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

  // "Full" Mode - Stitch "Mountain Path" Design
  return (
    <div className="relative py-4 pl-4">
      <h3 className="text-lg font-bold text-[#1d180c] mb-8 flex items-center gap-2">
        <Map className="text-[#ffc629]" />
        Lộ trình chinh phục
      </h3>

      <div className="relative flex flex-col gap-16 pb-12">
        <div className="absolute left-[27px] top-4 bottom-10 w-1 bg-repeating-linear-gradient-to-b from-[#eae2cd] to-transparent bg-[length:1px_20px] -z-0 border-l border-dashed border-[#eae2cd]"></div>

        {/* We need to reverse the order for the mountain path (High level at top? Stitch has 6 at top) 
            But typically users scroll DOWN to progress on web? 
            Stitch HTML shows HSK 6 (Locked) first, then goes down to HSK 1. 
            So it's a "Climb" visual but rendered top-down. 
            Let's reverse the stats array if we want Level 6 at top.
        */}
        {[...stats].reverse().map((stat) => {
          const progress = stat.total > 0 ? (stat.mastered / stat.total) * 100 : 0
          const isActive = currentLevel === stat.level
          const isMastered = progress === 100
          const isLocked = !isActive && !isMastered && progress === 0 // Simple logic

          return (
            <div key={stat.level} className={cn("flex gap-6 items-center relative", isLocked ? "opacity-60" : "")}>
              {/* Mascot Positioned for Active Level */}
              {isActive && (
                <div className="absolute -left-[14px] -top-[50px] z-20 pointer-events-none animate-bounce">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden">
                      <img src="/teacher-cat.png" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#e7564a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap border border-white">
                      Cố lên!
                    </div>
                  </div>
                </div>
              )}

              {/* Node Icon */}
              <Link href={`/learn?level=${stat.level}`} className={cn(
                "size-14 rounded-full border-4 flex items-center justify-center shrink-0 z-10 transition-transform hover:scale-110 cursor-pointer",
                isActive
                  ? "bg-[#ffc629] border-[#ffeeb0] shadow-[0_0_15px_rgba(255,198,41,0.5)]"
                  : isMastered
                    ? "bg-[#3c8c70] border-[#bce3d4]"
                    : "bg-[#f4f0e6] border-[#e5e0d0] text-[#a18845]"
              )}>
                {isActive ? (
                  <Star className="text-white w-7 h-7 fill-current" />
                ) : isMastered ? (
                  <Check className="text-white w-6 h-6" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </Link>

              {/* Card */}
              <Link
                href={`/learn?level=${stat.level}`}
                className={cn(
                  "flex-1 p-4 rounded-2xl border flex justify-between items-center shadow-sm transition-all cursor-pointer group",
                  isActive
                    ? "bg-white border-primary/20 hover:border-primary/50"
                    : isMastered
                      ? "bg-[#f0fdf7] border-[#dcfce7] opacity-80 hover:opacity-100"
                      : "bg-white border-[#f0ebe0]"
                )}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn("font-bold text-lg", isMastered ? "text-[#155e42]" : "text-[#1d180c]")}>
                      HSK {stat.level}: {getLevelTitle(stat.level)}
                    </h4>
                    {isActive && <span className="flex size-2 rounded-full bg-green-500 animate-pulse"></span>}
                  </div>
                  <p className={cn("text-xs", isMastered ? "text-[#3c8c70]" : "text-[#a18845]")}>
                    {isMastered ? "Hoàn thành xuất sắc" : `${stat.total} từ vựng`}
                  </p>

                  {isActive && (
                    <div className="w-full max-w-[120px] h-1.5 bg-[#eae2cd] rounded-full mt-2">
                      <div className="h-full bg-[#ffc629] rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  )}
                </div>

                {/* Right Side Status */}
                <div>
                  {isActive ? (
                    <div className="size-10 rounded-full bg-[#ffc629] text-[#1d180c] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                  ) : isMastered ? (
                    <div className="flex gap-1">
                      <Star className="text-[#ffc629] w-4 h-4 fill-current" />
                      <Star className="text-[#ffc629] w-4 h-4 fill-current" />
                      <Star className="text-[#ffc629] w-4 h-4 fill-current" />
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-lg bg-[#f4f0e6] text-[#a18845] text-xs font-bold">Khóa</div>
                  )}
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getLevelTitle(level: number) {
  switch (level) {
    case 1: return "Khởi đầu"
    case 2: return "Cơ bản"
    case 3: return "Trung cấp" // Stitch says 3 is active/current
    case 4: return "Trung cao"
    case 5: return "Cao cấp"
    case 6: return "Đỉnh cao"
    default: return "Thượng thừa"
  }
}
