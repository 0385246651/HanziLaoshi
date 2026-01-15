import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Handle PKCE Code Exchange
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const isPasswordReset = next === "/reset-password";
      const redirectTo = request.nextUrl.clone();
      redirectTo.pathname = next;
      redirectTo.searchParams.delete("code");

      if (!isPasswordReset) {
        redirectTo.searchParams.set("message", "Đăng nhập thành công!");
      }

      return NextResponse.redirect(redirectTo);
    } else {
      console.error("PKCE Error:", error);
      const redirectTo = request.nextUrl.clone();
      redirectTo.pathname = "/login";
      redirectTo.searchParams.set(
        "error",
        `Lỗi xác thực (PKCE): ${error.message}`
      );
      return NextResponse.redirect(redirectTo);
    }
  }

  // Handle Implicit/OTP Verification
  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      const redirectTo = request.nextUrl.clone();
      redirectTo.pathname = next;
      redirectTo.searchParams.delete("token_hash");
      redirectTo.searchParams.delete("type");

      // If verifying for password reset, don't show success login message yet
      const isPasswordReset = next === "/reset-password";
      if (!isPasswordReset) {
        redirectTo.searchParams.set(
          "message",
          "Xác thực email thành công! Vui lòng đăng nhập."
        );
      }

      return NextResponse.redirect(redirectTo);
    } else {
      console.error("OTP Verification Error:", error);
      const redirectTo = request.nextUrl.clone();
      redirectTo.pathname = "/login";
      redirectTo.searchParams.set(
        "error",
        `Lỗi xác thực (OTP): ${error.message}`
      );
      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = "/login";
  redirectTo.searchParams.set(
    "error",
    "Link không hợp lệ (Thiếu code/token). Vui lòng thử lại."
  );
  return NextResponse.redirect(redirectTo);
}
