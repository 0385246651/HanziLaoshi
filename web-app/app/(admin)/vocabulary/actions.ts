"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface VocabularyItem {
  hsk_level: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  audio_url?: string;
  example?: string;
  example_pinyin?: string;
  example_meaning?: string;
}

export async function importVocabulary(data: VocabularyItem[]) {
  const supabase = await createClient();

  // Verify admin access
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  // Insert data
  // Note: We're not checking for duplicates for simplicity in this MVP,
  // but in production we might want to upsert or check existing hanzi.
  const { error } = await supabase.from("vocabulary").insert(
    data.map((item) => ({
      ...item,
      created_by: user.id,
    }))
  );

  if (error) {
    console.error("Import error:", error);
    return { error: error.message };
  }

  revalidatePath("/vocabulary");
  return { success: true };
}

export async function deleteVocabulary(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("vocabulary").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/vocabulary");
  return { success: true };
}

export async function updateVocabulary(
  id: string,
  data: Partial<VocabularyItem>
) {
  const supabase = await createClient();
  const { error } = await supabase.from("vocabulary").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/vocabulary");
  return { success: true };
}

export async function createVocabulary(data: Omit<VocabularyItem, "id">) {
  const supabase = await createClient();

  // Verify admin access
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("vocabulary").insert({
    ...data,
    created_by: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/vocabulary");
  return { success: true };
}
