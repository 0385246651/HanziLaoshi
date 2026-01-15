import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user/UserNav";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#fcfbf8] font-display">
      <UserNav user={user} role={profile?.role || "user"} />
      <main className="max-w-7xl mx-auto p-4 ">
        {children}
      </main>
    </div>
  );
}
