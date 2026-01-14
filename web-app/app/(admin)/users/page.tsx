import { Suspense } from "react";
import { UsersTable } from "./users-table";
import { getUsers } from "./actions";
import { User, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const result = await getUsers();
  const userData = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1a0c] font-display flex items-center gap-2">
            <Users className="w-7 h-7 text-[#ff6933]" />
            Quản lý người dùng
          </h1>
          <p className="text-gray-500 mt-1">
            Xem danh sách và phân quyền thành viên
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-gray-500">Đang tải danh sách...</div>}>
        <UsersTable initialData={userData} />
      </Suspense>
    </div>
  );
}
