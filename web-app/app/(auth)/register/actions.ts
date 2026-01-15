"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Validating and parsing headers safely
  const headersList = await headers();
  const origin =
    headersList.get("origin") ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const hskGoalStr = formData.get("hskGoal") as string;

  // Safe parsing: extract number from "hsk1", "hsk2", etc. or use raw number
  let hskLevel = 1;
  if (hskGoalStr) {
    const match = hskGoalStr.match(/\d+/);
    if (match) {
      hskLevel = parseInt(match[0], 10);
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        hsk_level: hskLevel,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Supabase SignUp Error:", error);
    // For debugging: include the actual Supabase error message
    let errorMessage = `Lỗi: ${error.message} (Code: ${
      error.status || "unknown"
    })`;

    if (error.message.includes("User already registered")) {
      errorMessage = "Email này đã được đăng ký. Vui lòng đăng nhập.";
    } else if (error.message.includes("Password should be at least")) {
      errorMessage = "Mật khẩu phải có ít nhất 6 ký tự.";
    } else if (error.status === 429) {
      errorMessage = "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.";
    }

    redirect(`/register?error=${encodeURIComponent(errorMessage)}`);
  }

  revalidatePath("/", "layout");
  const successMessage =
    "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.";
  redirect(`/login?message=${encodeURIComponent(successMessage)}`);
}
