"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  try {
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

    // Safe integer parsing
    const hskLevel = hskGoalStr ? parseInt(hskGoalStr) : 1;

    const { error } = await supabase.auth.signUp({
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
      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";

      if (error.message.includes("User already registered")) {
        errorMessage = "Email này đã được đăng ký. Vui lòng đăng nhập.";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "Mật khẩu phải có ít nhất 6 ký tự.";
      } else if (error.status === 429) {
        errorMessage = "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.";
      }

      redirect(`/register?error=${encodeURIComponent(errorMessage)}`);
    }
  } catch (e) {
    console.error("Unexpected Error in Signup:", e);
    // If it's a redirect error, rethrow it so Next.js handles it
    if ((e as any)?.digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    redirect(
      `/register?error=${encodeURIComponent(
        "Đã có lỗi không mong muốn xảy ra."
      )}`
    );
  }

  revalidatePath("/", "layout");
  redirect(
    "/login?message=Đăng ký thành công! Vui lòng kiểm tra email để xác thực."
  );
}
