"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { CgSpinner } from "react-icons/cg";
import { cn } from "@/lib/utils";

const SignUpButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full bg-[#c5a059] hover:bg-[#b08e4d] text-black font-bold uppercase tracking-[0.2em] text-sm h-12 rounded-md shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed",
      )}
    >
      {pending ? (
        <div className="flex items-center justify-center gap-2">
          <CgSpinner className="h-5 w-5 animate-spin" />
          <span>Submitting...</span>
        </div>
      ) : (
        "Sign Up"
      )}
    </Button>
  );
};

export default SignUpButton;
