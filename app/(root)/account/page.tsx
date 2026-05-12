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

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const { user } = session;

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/5 p-4">
      <Card className="w-full max-w-md shadow-lg bg-black text-white">
        <CardHeader className="flex flex-col items-center space-y-4 ">
          <Avatar className="h-24 w-24 border border-primary">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback className="text-2xl">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Account Status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
            <div>
              <p className="text-muted-foreground">Role</p>
              <p className="font-medium">User</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="w-full"
          >
            <Button variant="destructive" className="w-full">
              Sign Out
            </Button>
          </form>
          <Button className="w-full hover:bg-[#C5A25D]" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
