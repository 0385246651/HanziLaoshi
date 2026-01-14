import { Suspense } from "react";
import { Settings } from "lucide-react";
import { SettingsForm } from "./settings-form";
import { getSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings(["general_config", "branding", "contact_info"]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1a0c] font-display flex items-center gap-2">
            <Settings className="w-7 h-7 text-[#ff6933]" />
            Cài đặt hệ thống
          </h1>
          <p className="text-gray-500 mt-1">
            Tuỳ chỉnh giao diện, thông tin và cấu hình ứng dụng
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-gray-500">Đang tải cài đặt...</div>}>
        <SettingsForm initialSettings={settings} />
      </Suspense>
    </div>
  );
}
