import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl py-6 px-4">
      <div className="mb-6">
        <div className="flex items-center text-gray-400">
          <ChevronLeft className="w-4 h-4 mr-1" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Progress Bar */}
        <div className="w-full max-w-lg mb-8 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        {/* Flashcard */}
        <Skeleton className="w-full max-w-lg h-[500px] rounded-3xl shadow-sm" />

        {/* Control Buttons */}
        <div className="grid grid-cols-3 gap-4 w-full mt-10 max-w-lg">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
