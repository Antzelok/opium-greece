"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { SignInDefaultValues } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignInButton from "@/components/auth/SignInButton";

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action} className="w-100">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold"
          >
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={SignInDefaultValues.email}
            className="bg-transparent border-white/10 focus:border-[#c5a059] rounded-none h-12 transition-colors text-white"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold"
          >
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={SignInDefaultValues.password}
            className="bg-transparent border-white/10 focus:border-[#c5a059] rounded-none h-12 transition-colors text-white"
          />
        </div>

        {/* Submit Button Component */}
        <div className="pt-2">
          <SignInButton text="Sign In" pendingText="Signing In..." />
        </div>

        {/* Error Message */}
        {data && !data.success && (
          <div className="text-center text-red-500 text-[11px] font-medium bg-red-500/5 py-3 border border-red-500/10 uppercase tracking-wider">
            {data.message}
          </div>
        )}

        {/* Link to Sign Up */}
        <div className="text-[11px] text-center text-neutral-500 uppercase tracking-widest">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#c5a059] hover:text-[#b08e4d] font-bold transition-colors ml-1"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
