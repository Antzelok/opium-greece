"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignInButton from "@/components/auth/SignInButton";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { SignInDefaultValues } from "@/lib/constants";

interface CredentialsSignInFormProps {
  callbackUrl?: string;
}

const CredentialsSignInForm = ({
  callbackUrl: propCallbackUrl,
}: CredentialsSignInFormProps) => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();

  const callbackUrl = propCallbackUrl || searchParams.get("callbackUrl") || "/";

  return (
    <form action={action} className="space-y-5 w-full">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

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
          className="bg-black border-white/10 text-white focus:border-[#C5A25D] focus:ring-[#C5A25D] h-12 rounded-none transition-all"
        />
      </div>

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
          autoComplete="current-password"
          defaultValue={SignInDefaultValues.password}
          className="bg-black border-white/10 text-white focus:border-[#C5A25D] focus:ring-[#C5A25D] h-12 rounded-none transition-all"
        />
      </div>

      <div className="pt-2">
        <SignInButton />
      </div>

      {data && !data.success && (
        <div className="text-center text-[#c5a059] text-[11px] font-medium bg-[#c5a059]/10 py-3 border border-[#c5a059]/20 uppercase tracking-wider">
          {data.message}
        </div>
      )}

      <div className="text-[11px] text-center text-neutral-500 uppercase tracking-widest">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-[#C5A25D] hover:text-[#e0bc7a] transition-colors font-bold ml-1"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
