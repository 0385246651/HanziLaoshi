"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  created_at: string;
  current_hsk_level: number;
}

export async function getUsers() {
  const supabase = await createClient();

  // Verify admin access
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  // Check if the current user is an admin
  const { data: currentUserProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !currentUserProfile ||
    currentUserProfile.role !== "admin"
  ) {
    return { error: "Permission denied" };
  }

  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch users" };
  }

  return { success: true, data: profiles as UserProfile[] };
}

export async function updateUserRole(
  userId: string,
  newRole: "user" | "admin"
) {
  const supabase = await createClient();

  // Verify admin access (double check)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Check if the current user is an admin
  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!currentUserProfile || currentUserProfile.role !== "admin") {
    return { error: "Permission denied" };
  }

  // Update role
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    console.error("Error updating role:", error);
    return { error: "Failed to update role" };
  }

  revalidatePath("/users");
  return { success: true };
}
