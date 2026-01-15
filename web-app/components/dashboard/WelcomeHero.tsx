"use client"

import { Play, Calculator } from "lucide-react"

export function WelcomeHero({ userValues }: { userValues?: { name?: string, currentLevel?: string } }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgba(29,24,12,0.04)] border border-[#f0ebe0] p-6 sm:p-8 group mb-8">
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#fff9e6] -skew-x-12 translate-x-10 z-0"></div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#fff4cc] text-[#a18845]">
              Buổi sáng tốt lành
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1d180c] mb-2 tracking-tight">
            Chào mừng trở lại, {userValues?.name || "Bạn"}!
          </h1>
          <p className="text-[#6b5c35] text-sm sm:text-base mb-6">
            Bạn đang làm rất tốt! Hãy tiếp tục hành trình chinh phục HSK {userValues?.currentLevel || 3}.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#ffc629] hover:bg-[#ffcf4d] text-[#1d180c] font-bold rounded-xl transition-transform hover:scale-105 shadow-sm shadow-orange-200">
              <Play className="w-5 h-5 fill-current" />
              <span>Học tiếp ngay</span>
            </button>
            {/* <div className="px-4 py-3 bg-[#f8f8f5] rounded-xl text-[#6b5c35] text-sm font-medium border border-[#eae2cd]">
              Bài 4: Sở thích
            </div> */}
          </div>
        </div>

        <div className="w-32 sm:w-40 shrink-0 relative">
          {/* Mascot Placeholder */}
          <div
            className="aspect-square bg-orange-100 rounded-full flex items-center justify-center relative overflow-hidden border-4 border-white shadow-lg"
            style={{ background: "radial-gradient(circle at 30% 30%, #ffd699, #ffaf4d)" }}
          >
            {/* Use the teacher cat image we have */}
            <img
              className="w-full h-full object-contain p-2"
              src="/teacher-cat.png"
              alt="Teacher Cat"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#3c8c70] text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
            Lvl. 12
          </div>
        </div>
      </div>
    </div>
  )
}
