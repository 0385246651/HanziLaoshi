import { getVocabulary, getFilteredVocabulary } from "@/app/(user)/learn/actions"
import { FlashcardClient } from "@/components/learn/FlashcardClient"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function FlashcardsPage({
  params,
  searchParams,
}: {
  params: Promise<{ level: string }>
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { level: levelStr } = await params
  const { status, page: pageStr } = await searchParams
  const level = parseInt(levelStr)
  const page = parseInt(pageStr || "1")
  const limit = 25

  let vocabulary = []
  let total = 0

  if (status && ['new', 'learning', 'mastered'].includes(status as string)) {
    const res = await getFilteredVocabulary(level, status as 'new' | 'learning' | 'mastered', page, limit)
    vocabulary = res.data
    total = res.total
  } else {
    const res = await getVocabulary(level, page, limit)
    vocabulary = res.data
    total = res.total
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto max-w-4xl py-2 px-4 overflow-hidden">
      <FlashcardClient
        key={`${level}-${page}-${status}`} // Force reset on page change
        vocabulary={vocabulary}
        hskLevel={level}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  )
}
