"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { signUpUser } from "@/lib/actions/user.actions";
import { SignUpDefaultValues } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignUpButton from "@/components/auth/SignUpButton";
import VerificationNotice from "@/email-verif/verification-notice";

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <>
      {data.success ? (
        <VerificationNotice />
      ) : (
        <form action={action} className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div className="space-y-1">
            <Label
              htmlFor="name"
              className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-bold"
            >
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              defaultValue={SignUpDefaultValues.name}
              className="bg-black border-white/10 text-white focus:border-[#C5A25D] focus:ring-[#C5A25D] h-12 rounded-md transition-all"
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="email"
              className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-bold"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={SignUpDefaultValues.email}
              className="bg-black border-white/10 text-white focus:border-[#C5A25D] focus:ring-[#C5A25D] h-12 rounded-md transition-all"
            />
          </div>

          <div className="space-y-1">
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
                autoComplete="new-password"
                defaultValue={SignUpDefaultValues.password}
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

          <div className="space-y-1">
            <Label
              htmlFor="confirmPassword"
              className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-bold"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                defaultValue={SignUpDefaultValues.confirmPassword}
                className="bg-black border-white/10 text-white focus:border-[#C5A25D] focus:ring-[#C5A25D] h-12 rounded-md transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <SignUpButton />

          {data && !data.success && (
            <div className="text-center text-[#c5a059] text-[11px] font-medium py-2 rounded-md uppercase tracking-wider">
              {data.message}
            </div>
          )}

          <div className="text-[11px] text-center text-neutral-500 uppercase tracking-widest">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-[#C5A25D] hover:text-[#e0bc7a] transition-colors font-medium hover:underline"
            >
              Sign In
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default SignUpForm;
