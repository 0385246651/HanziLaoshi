import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminShell from "./admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await (await supabase).auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await (await supabase)
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <AdminShell user={user} profile={profile}>
      {children}
    </AdminShell>
  );
}
