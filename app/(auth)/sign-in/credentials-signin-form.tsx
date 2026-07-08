"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignInButton from "@/components/auth/SignInButton";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { SignInDefaultValues } from "@/lib/constants";
import { Eye, EyeOff } from "lucide-react";

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

  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();

  const callbackUrl = propCallbackUrl || searchParams.get("callbackUrl") || "/";

  return (
    <form action={action} className="space-y-5 w-full">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-bold"
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
          className="bg-black border-white/10 text-white focus:border-[#C5A25D] focus:ring-[#C5A25D] h-12 rounded-md transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-bold"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            defaultValue={SignInDefaultValues.password}
            className="bg-black border-white/10 text-white focus:border-[#C5A25D] focus:ring-[#C5A25D] h-12 rounded-md transition-all pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <SignInButton />
      </div>
      {data && !data.success && (
        <div className="text-center text-[#c5a059] text-[11px] font-medium py-3 uppercase tracking-wider">
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
