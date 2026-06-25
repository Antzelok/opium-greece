"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signUpUser } from "@/lib/actions/user.actions";
import { SignUpDefaultValues } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignUpButton from "@/components/auth/SignUpButton";
import { toast } from "sonner";

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (data.message) {
      if (data.success) {
        toast.success(data.message);
        router.push("/sign-in");
      } else {
        toast.error(data.message);
      }
    }
  }, [data, router]);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const inputStyles =
    "bg-neutral-900 border-white/10 text-white focus:border-[#C5A25D] focus:ring-[#C5A25D] transition-all";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-1">
        <Label htmlFor="name" className="text-neutral-300">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          defaultValue={SignUpDefaultValues.name}
          className={inputStyles}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email" className="text-neutral-300">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={SignUpDefaultValues.email}
          className={inputStyles}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password" className="text-neutral-300">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          defaultValue={SignUpDefaultValues.password}
          className={inputStyles}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword" className="text-neutral-300">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          defaultValue={SignUpDefaultValues.confirmPassword}
          className={inputStyles}
        />
      </div>

      <SignUpButton />

      {data && !data.success && (
        <div className="text-center text-[#c5a059] text-sm font-medium bg-[#c5a059]/10 py-2 rounded-md border border-[#c5a059]/20">
          {data.message}
        </div>
      )}

      <div className="text-sm text-center text-neutral-400 pt-2">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-[#C5A25D] hover:text-[#e0bc7a] transition-colors font-medium hover:underline"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
