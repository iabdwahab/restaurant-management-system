"use client";

import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Utensils, AlertCircle } from "lucide-react";
import { useActionState } from "react";

export default function LoginPage() {
  const [loginState, loginAction, isLoginPending] = useActionState(
    login,
    undefined,
  );
  const [signupState, signupAction, isSignupPending] = useActionState(
    signup,
    undefined,
  );

  const error = loginState?.error || signupState?.error;
  const isPending = isLoginPending || isSignupPending;

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-zinc-50 p-4"
    >
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <Utensils className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            نظام إدارة المطاعم
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            يرجى تسجيل الدخول للمتابعة إلى لوحة التحكم
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-500/10">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2 text-right">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-zinc-700"
              >
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@example.com"
                className="h-11 text-right"
                dir="ltr"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2 text-right">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700"
              >
                كلمة المرور
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="h-11 text-right font-sans tracking-widest placeholder:tracking-normal"
                dir="ltr"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              formAction={loginAction}
              disabled={isPending}
              className="h-11 w-full bg-orange-600 text-white hover:bg-orange-700 shadow-sm transition-all focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 disabled:bg-orange-600/60"
            >
              {isLoginPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
            {/* <div className="relative flex items-center py-2">
              <div className="grow border-t border-zinc-200"></div>
              <span className="shrink-0 px-4 text-xs text-zinc-400">أو</span>
              <div className="grow border-t border-zinc-200"></div>
            </div>
            <Button
              formAction={signupAction}
              variant="outline"
              disabled={isPending}
              className="h-11 w-full border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium transition-all disabled:bg-zinc-50/50"
            >
              {isSignupPending ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}
            </Button> */}
          </div>
        </form>
      </div>
    </div>
  );
}
