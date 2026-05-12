import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const { user } = session;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/95 p-4">
      <Card className="w-full max-w-md shadow-2xl bg-black border-white/10 text-white">
        <CardHeader className="flex flex-col items-center space-y-4">
          {/* Logo to match Auth Pages */}
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/opium-logo.jpg"
              height={45}
              width={120}
              alt="Logo"
              priority
              className="h-auto w-auto"
            />
          </Link>

          <Avatar className="h-24 w-24 border-2 border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.2)]">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback className="text-2xl bg-neutral-900 text-[#c5a059]">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {user?.name}
            </CardTitle>
            <CardDescription className="text-neutral-400">
              {user?.email}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator className="bg-white/10" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-neutral-500 uppercase tracking-tighter text-[10px] font-bold">
                Account Status
              </p>
              <p className="font-medium text-[#c5a059]">Active</p>
            </div>
            <div className="space-y-1">
              <p className="text-neutral-500 uppercase tracking-tighter text-[10px] font-bold">
                Member Role
              </p>
              <p className="font-medium text-white">Verified User</p>
            </div>
          </div>

          <Separator className="bg-white/10" />
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pb-8">
          <Button
            asChild
            className="w-full bg-[#c5a059] hover:bg-[#b08e4d] text-black font-bold tracking-[0.2em] text-sm h-12 rounded-md shadow-lg transition-all duration-300"
          >
            <Link href="/">BACK TO HOME</Link>
          </Button>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="w-full"
          >
            <Button
              variant="ghost"
              className="w-full text-neutral-500 hover:text-white hover:bg-red-400 tracking-widest text-sm "
            >
              SIGN OUT
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AccountPage;
