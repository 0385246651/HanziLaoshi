import { Suspense } from "react"
import { getVocabulary, getUserStats } from "./actions"
import { LevelSidebar } from "@/components/learn/LevelSidebar"
import { VocabCard } from "@/components/learn/VocabCard"
import { Pagination } from "@/components/learn/Pagination"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; page?: string }>
}) {
  const { level: levelStr, page: pageStr } = await searchParams
  const level = parseInt(levelStr || "1")
  const page = parseInt(pageStr || "1")
  const limit = 12 // Cards per page

  const [vocabData, stats] = await Promise.all([
    getVocabulary(level, page, limit),
    getUserStats()
  ])

  const { data: vocabulary, total } = vocabData
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar - Visible on Desktop */}
      <div className="hidden md:block flex-shrink-0">
        <LevelSidebar stats={stats} />
      </div>

      {/* Mobile Stats / Level Selector (Simplified) */}
      <div className="md:hidden w-full overflow-x-auto pb-4 flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((l) => (
          <Link
            key={l}
            href={`/learn?level=${l}`}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border ${level === l
              ? "bg-[#ff6933] text-white border-[#ff6933]"
              : "bg-white text-gray-600 border-gray-200"
              }`}
          >
            HSK {l}
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Từ vựng HSK {level}
            </h1>
            <span className="text-gray-500 text-sm">
              Trang {page}/{totalPages || 1}
            </span>
          </div>

          <Button asChild className="w-full sm:w-auto bg-[#ff6933] hover:bg-[#ff8c5a] shadow-md shadow-orange-200">
            <Link href={`/learn/${level}/flashcards`}>
              Vào học ngay 🚀
            </Link>
          </Button>
        </div>

        {vocabulary.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">Chưa có từ vựng nào ở cấp độ này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vocabulary.map((vocab: any) => (
              <VocabCard key={vocab.id} vocab={vocab} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} level={level} />
        )}
      </div>
    </div>
  )
}
