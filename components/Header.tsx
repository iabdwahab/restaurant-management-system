import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/login/actions";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      dir="rtl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-heading text-primary">
            المطعم
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="outline">
                <Link href="/dashboard">لوحة التحكم</Link>
              </Button>
              <form action={logout}>
                <Button type="submit" variant="destructive">
                  تسجيل الخروج
                </Button>
              </form>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
