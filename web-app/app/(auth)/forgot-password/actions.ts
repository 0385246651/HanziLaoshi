"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  try {
    const supabase = await createClient();

    // Safe origin retrieval with fallback
    const headersList = await headers();
    const origin =
      headersList.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      redirect(
        `/forgot-password?error=${encodeURIComponent("Email không hợp lệ")}`
      );
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      console.error("Supabase resetPasswordForEmail Error:", error);
      if (error.message.includes("Rate limit")) {
        redirect(
          `/forgot-password?error=${encodeURIComponent(
            "Vui lòng đợi 60 giây trước khi thử lại"
          )}`
        );
      }
      redirect(
        `/forgot-password?error=${encodeURIComponent(
          "Không thể gửi email. Vui lòng thử lại sau"
        )}`
      );
    }

    // Success redirect
    redirect(
      `/forgot-password?message=${encodeURIComponent(
        "Kiểm tra email của bạn để đặt lại mật khẩu"
      )}`
    );
  } catch (error) {
    if ((error as any)?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Forgot Password Action CRITICAL ERROR:", error);
    redirect(
      `/forgot-password?error=${encodeURIComponent(
        "Đã có lỗi xảy ra. Hãy kiểm tra server logs."
      )}`
    );
  }
}
