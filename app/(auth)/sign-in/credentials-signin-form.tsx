"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignInButton from "@/components/auth/SignInButton";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { SignInDefaultValues } from "@/lib/constants";

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-2">
        <Label htmlFor="email" className="text-neutral-300">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={SignInDefaultValues.email}
          className="bg-neutral-900 border-white/10 text-white focus:border-[#C5A25D] focus:ring-[#C5A25D] transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-neutral-300">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          defaultValue={SignInDefaultValues.password}
          className="bg-neutral-900 border-white/10 text-white focus:border-[#C5A25D] focus:ring-[#C5A25D] transition-all"
        />
      </div>

      <div>
        <SignInButton />
      </div>

      {data && !data.success && (
        <div className="text-center text-destructive">{data.message}</div>
      )}

      <div className="text-sm text-center text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          target="_self"
          className="text-[#C5A25D] hover:text-[#e0bc7a] transition-colors font-medium hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
