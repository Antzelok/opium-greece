import Link from "next/link";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const VerificationNotice = () => {
  return (
    <Card className="bg-neutral-900 border-white/10 text-white">
      <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
        <MdOutlineMarkEmailRead className="text-[#c5a059] text-6xl" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold">Check your email!</h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            We&apos;ve sent a verification link to your inbox.
            <br />
            Please verify your email to activate your account.
          </p>
        </div>
        <Separator className="bg-white/10" />
        <p className="text-neutral-500 text-xs">
          Redirecting to sign in in a few seconds...
        </p>
        <Button
          asChild
          variant="link"
          className="text-[#C5A25D] hover:text-[#e0bc7a] p-0"
        >
          <Link href="/sign-in">Go to Sign In now</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerificationNotice;