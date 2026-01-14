"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Trophy, Target, Zap } from "lucide-react"

export function DashboardStats({
  vocabCount = 0,
  hskLevel = 1,
  masteredCount = 0
}: {
  vocabCount: number,
  hskLevel: number,
  masteredCount: number
}) {
  // Mock calculations for demo
  const hskVocabTargets = [150, 300, 600, 1200, 2500, 5000]
  const currentTarget = hskVocabTargets[hskLevel - 1] || 150
  const progressPercent = Math.min(100, Math.round((vocabCount / currentTarget) * 100))

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* HSK Progress Card */}
      <Card className="border-0 shadow-sm ring-1 ring-orange-100 bg-gradient-to-br from-orange-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-600">
            Cấp độ hiện tại
          </CardTitle>
          <Target className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 mb-2">HSK {hskLevel}</div>
          <Progress value={progressPercent} className="h-2 bg-orange-100" />
          <p className="text-xs text-gray-500 mt-2">
            Đã thuộc {vocabCount} / {currentTarget} từ vựng
          </p>
        </CardContent>
      </Card>

      {/* Mastered Card */}
      <Card className="border-0 shadow-sm ring-1 ring-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">
            Từ đã thuộc
          </CardTitle>
          <Trophy className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{masteredCount}</div>
          <p className="text-xs text-gray-500 mt-1">
            +12 từ so với tuần trước
          </p>
        </CardContent>
      </Card>

      {/* Learning Streak Card */}
      <Card className="border-0 shadow-sm ring-1 ring-green-100 bg-gradient-to-br from-green-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-600">
            Chuỗi ngày học
          </CardTitle>
          <Zap className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">3 Ngày</div>
          <p className="text-xs text-gray-500 mt-1">
            Giữ vững phong độ nhé! 🔥
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
