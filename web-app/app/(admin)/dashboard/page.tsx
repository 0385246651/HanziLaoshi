import { Suspense } from "react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#2E333D]">Tổng quan</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Tổng người dùng</h3>
          <p className="text-3xl font-bold text-[#2E333D] mt-2">1,234</p>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span>+12% so với tháng trước</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Từ vựng đã học</h3>
          <p className="text-3xl font-bold text-[#2E333D] mt-2">45,678</p>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span>+8% so với tháng trước</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Người dùng mới (Hôm nay)</h3>
          <p className="text-3xl font-bold text-[#2E333D] mt-2">15</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center text-gray-400">
        Biểu đồ thống kê sẽ hiển thị ở đây
      </div>
    </div>
  );
}
