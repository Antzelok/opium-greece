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
import { MdOutlineMarkEmailRead } from "react-icons/md";

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (data.message && !data.success) {
      toast.error(data.message);
    }
    if (data.success) {
      const timer = setTimeout(() => router.push("/sign-in"), 5000);
      return () => clearTimeout(timer);
    }
  }, [data, router]);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const inputStyles =
    "bg-neutral-900 border-white/10 text-white focus:border-[#C5A25D] focus:ring-[#C5A25D] transition-all";

  return (
    <>
      {data.success ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <MdOutlineMarkEmailRead className="text-[#c5a059] text-6xl" />
          <h2 className="text-xl font-bold text-white">Check your email!</h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            We&apos;ve sent a verification link to your inbox.
            <br />
            Please verify your email to activate your account.
          </p>
          <p className="text-neutral-500 text-xs">
            Redirecting to sign in in a few seconds...
          </p>
          <Link
            href="/sign-in"
            className="text-[#C5A25D] hover:text-[#e0bc7a] transition-colors font-medium hover:underline text-sm"
          >
            Go to Sign In now
          </Link>
        </div>
      ) : (
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
      )}
    </>
  );
};

export default SignUpForm;
