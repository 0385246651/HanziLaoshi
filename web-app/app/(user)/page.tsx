import { createClient } from "@/utils/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { WelcomeHero } from "@/components/dashboard/WelcomeHero"
import { ConquestRoadmap } from "@/components/learn/ConquestRoadmap"
import { StatsSidebar } from "@/components/learn/StatsSidebar"
import { getUserStats } from "./learn/actions"

export default async function Index() {
  const supabase = await createClient()

  // Fetch basic user validation (handled in layout generally, but good for safe data fetching)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let stats: any[] = []
  let userValues = { name: user?.email?.split('@')[0], currentLevel: "3" }

  if (user) {
    // Reuse the stats fetching logic from /learn
    stats = await getUserStats()

    // Mocking user name from metadata if available
    if (user.user_metadata?.full_name) {
      userValues.name = user.user_metadata.full_name
    }

    // Determine active level (first one not fully mastered? or just hardcoded/searchParam)
    // For now we'll let ConquestRoadmap handle logical highlighting or default
  }

  // Fallback stats if empty (new user)
  if (!stats.length) {
    stats = Array.from({ length: 6 }, (_, i) => ({
      level: i + 1,
      total: 100 * (i + 1),
      mastered: 0,
      learning: 0,
      new: 100 * (i + 1)
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
      {/* Left Column: Navigation Sidebar (2 cols) */}
      <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
        <DashboardSidebar />
      </div>

      {/* Center Column: Main Content (7 cols) */}
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
        <WelcomeHero userValues={userValues} />

        {/* Conquest Roadmap in 'full' mode acting as the Mountain Path */}
        <div className="bg-white rounded-3xl p-6 border border-[#f0ebe0]">
          <ConquestRoadmap stats={stats} mode="full" />
        </div>
      </div>

      {/* Right Column: Widgets (3 cols) */}
      <div className="hidden xl:block xl:col-span-3">
        <StatsSidebar stats={stats} />
      </div>

      {/* Mobile Support Warning/Adjustment? 
           The layout uses hidden classes to stack or hide on mobile. 
           Mobile view usually just shows Center column.
           We might want to show bottom nav or similar for mobile in the Layout later.
       */}
    </div>
  )
}
