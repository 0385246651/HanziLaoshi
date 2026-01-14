"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";

    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Email hoặc mật khẩu không chính xác.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage =
        "Email chưa được xác nhận. Vui lòng kiểm tra hộp thư của bạn.";
    } else if (error.status === 429) {
      errorMessage = "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.";
    }

    redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
