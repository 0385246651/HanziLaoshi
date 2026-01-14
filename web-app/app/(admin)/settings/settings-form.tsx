"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, Save, Settings as SettingsIcon, Store, Contact } from "lucide-react"
import { updateSettings, uploadLogo } from "./actions"

interface SettingsFormProps {
  initialSettings: Record<string, any>
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  // -- State for each config group --
  const [generalConfig, setGeneralConfig] = useState({
    darkMode: initialSettings.general_config?.darkMode || false,
    showTips: initialSettings.general_config?.showTips ?? true,
  })

  const [brandingConfig, setBrandingConfig] = useState({
    slogan: initialSettings.branding?.slogan || "Học tiếng Trung hiệu quả mỗi ngày",
    logoUrl: initialSettings.branding?.logoUrl || "",
  })

  const [contactInfo, setContactInfo] = useState({
    email: initialSettings.contact_info?.email || "",
    phone: initialSettings.contact_info?.phone || "",
    address: initialSettings.contact_info?.address || "",
  })

  // -- Handlers --

  // 1. Save Handler (Generic)
  const handleSave = async (key: string, value: any, groupName: string) => {
    setIsSaving(true)
    const result = await updateSettings(key, value)
    setIsSaving(false)

    if (result.success) {
      toast.success(`Đã lưu cài đặt ${groupName}`)
      router.refresh()
    } else {
      toast.error("Lỗi lưu cài đặt: " + result.error)
    }
  }

  // 2. Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    const loadingToast = toast.loading("Đang tải lên logo...")

    try {
      const result = await uploadLogo(formData)

      if (result.success && result.url) {
        // Update local state and auto-save
        const newBranding = { ...brandingConfig, logoUrl: result.url }
        setBrandingConfig(newBranding)
        await updateSettings("branding", newBranding)

        toast.dismiss(loadingToast)
        toast.success("Đã cập nhật Logo")
        router.refresh()
      } else {
        toast.dismiss(loadingToast)
        toast.error("Lỗi upload: " + result.error)
      }
    } catch (err) {
      toast.dismiss(loadingToast)
      toast.error("Đã có lỗi xảy ra")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-orange-50 data-[state=active]:text-[#ff6933] font-medium">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Cấu hình chung
          </TabsTrigger>
          <TabsTrigger value="branding" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-medium">
            <Store className="w-4 h-4 mr-2" />
            Thương hiệu
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-lg data-[state=active]:bg-green-50 data-[state=active]:text-green-600 font-medium">
            <Contact className="w-4 h-4 mr-2" />
            Liên hệ
          </TabsTrigger>
        </TabsList>

        {/* --- GENERAL TAB --- */}
        <TabsContent value="general">
          <Card className="border-0 shadow-sm ring-1 ring-gray-100">
            <CardHeader>
              <CardTitle>Cấu hình chung</CardTitle>
              <CardDescription>Quản lý các hiển thị cơ bản của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode (Giao diện tối)</Label>
                  <p className="text-sm text-gray-500">
                    Bật chế độ tối mặc định cho ứng dụng
                  </p>
                </div>
                <Switch
                  checked={generalConfig.darkMode}
                  onCheckedChange={(checked) => setGeneralConfig({ ...generalConfig, darkMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="space-y-0.5">
                  <Label className="text-base">Hiển thị Mẹo & Gợi ý</Label>
                  <p className="text-sm text-gray-500">
                    Hiển thị các tips học tập trên trang Dashboard
                  </p>
                </div>
                <Switch
                  checked={generalConfig.showTips}
                  onCheckedChange={(checked) => setGeneralConfig({ ...generalConfig, showTips: checked })}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => handleSave("general_config", generalConfig, "Chung")}
                  disabled={isSaving}
                  className="bg-[#ff6933] hover:bg-[#e55022] text-white"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- BRANDING TAB --- */}
        <TabsContent value="branding">
          <Card className="border-0 shadow-sm ring-1 ring-gray-100">
            <CardHeader>
              <CardTitle>Thương hiệu</CardTitle>
              <CardDescription>Logo và Slogan hiển thị trên ứng dụng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Logo ứng dụng</Label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                    {brandingConfig.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={brandingConfig.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-2">Chưa có Logo</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label htmlFor="logo-upload" className="cursor-pointer text-white text-xs font-bold">
                        Thay đổi
                      </label>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      className="mb-2"
                    >
                      <Upload className="w-4 h-4 mr-2" /> Upload hình ảnh
                    </Button>
                    <p className="text-xs text-gray-500">
                      Định dạng hỗ trợ: PNG, JPG, WebP. Kích thước tối đa 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Slogan (Khẩu hiệu)</Label>
                <Input
                  value={brandingConfig.slogan}
                  onChange={(e) => setBrandingConfig({ ...brandingConfig, slogan: e.target.value })}
                  placeholder="Nhập slogan của ứng dụng..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => handleSave("branding", brandingConfig, "Thương hiệu")}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- CONTACT TAB --- */}
        <TabsContent value="contact">
          <Card className="border-0 shadow-sm ring-1 ring-gray-100">
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
              <CardDescription>Thông tin hiển thị ở footer hoặc trang liên hệ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email liên hệ</Label>
                  <Input
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="+84..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Địa chỉ văn phòng</Label>
                <Textarea
                  rows={3}
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  placeholder="Nhập địa chỉ..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => handleSave("contact_info", contactInfo, "Liên hệ")}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
