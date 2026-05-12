import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./signup-form";

export const metadata: Metadata = {
  title: `Sign Up`,
};

const SignUpPage = async (props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/95 p-4">
      <Card className="w-full max-w-md shadow-2xl bg-black border-white/10 text-white">
        <CardHeader className="space-y-4 flex flex-col items-center">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/opium-logo.jpg"
              height={45}
              width={120}
              alt={`${APP_NAME} logo`}
              priority={true}
              className="h-auto w-auto"
            />
          </Link>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create Account
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Join Opium Greece today
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
