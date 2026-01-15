"use client"

import { Crown } from "lucide-react"

export function DashboardSidebar() {
  return (
    <aside className="w-full flex flex-col shrink-0 sticky top-24">
      {/* Red Couplet (Câu Đối Đỏ) Section - Adjusted height to fit viewport */}
      <div className="relative group cursor-pointer overflow-hidden rounded-3xl border-[6px] border-[#8B0000] bg-[#e7564a] p-2 shadow-xl h-[calc(100vh-120px)] min-h-[500px] flex flex-col transform transition-transform hover:scale-[1.01]">
        {/* Inner Border */}
        <div className="h-full w-full rounded-xl border-[3px] border-dashed border-[#ffc629] p-6 flex flex-col items-center justify-center gap-6 relative z-10 bg-[url('https://www.transparenttextures.com/patterns/red-paper.png')]">

          {/* Top Decor */}
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <span className="w-3 h-3 rounded-full bg-[#ffc629]"></span>
            <span className="text-sm uppercase font-black text-[#ffc629] tracking-[0.2em]">Khuyến Học</span>
            <span className="w-3 h-3 rounded-full bg-[#ffc629]"></span>
          </div>

          {/* Main Text (Couplet) */}
          <div className="flex flex-col items-center gap-4 flex-1 justify-center">
            <h3 className="text-6xl font-black text-[#ffc629] drop-shadow-lg leading-tight py-4" style={{ writingMode: 'vertical-rl' }}>
              學海無涯
            </h3>

            <div className="flex flex-col gap-2 items-center mt-4">
              <p className="text-xl text-white/95 font-bold italic text-center font-serif">
                "Học hải vô nhai"
              </p>
              <div className="w-16 h-1 bg-white/30 rounded-full"></div>
              <p className="text-lg text-white/90 text-center font-medium">
                Biển học vô bờ
              </p>
            </div>
          </div>

          {/* Bottom Decor */}
          <div className="mt-4 w-16 h-16 rounded-full bg-[#8B0000] flex items-center justify-center border-4 border-[#ffc629] shadow-inner">
            <Crown className="w-8 h-8 text-[#ffc629] fill-current" />
          </div>

          {/* Subtle Tassel Effect */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-12 h-12 rotate-45 bg-[#8B0000] -z-10 shadow-xl"></div>
        </div>
      </div>
    </aside>
  )
}
