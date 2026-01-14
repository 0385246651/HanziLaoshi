"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSettings(keys: string[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("system_settings")
    .select("key, value")
    .in("key", keys);

  if (error) {
    console.error("Error fetching settings:", error);
    return {};
  }

  // Convert array to object map
  const settingsMap: Record<string, any> = {};
  data.forEach((item) => {
    settingsMap[item.key] = item.value;
  });

  return settingsMap;
}

export async function updateSettings(key: string, value: any) {
  const supabase = await createClient();

  // Check admin permission
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Permission denied" };
  }

  const { error } = await supabase
    .from("system_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/"); // Revalidate global layout likely using these settings
  return { success: true };
}

export async function uploadLogo(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file) return { error: "No file uploaded" };

  // Check admin permission
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Permission denied" };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `logo-${Date.now()}.${fileExt}`;
  const filePath = `branding/${fileName}`;

  // Upload to 'avatars' bucket (reusing existing bucket for now)
  // In production, 'assets' or 'public' bucket is better
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return { success: true, url: publicUrl };
}
