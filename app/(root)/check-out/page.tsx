"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { updateCartGuestEmail } from "@/lib/actions/cart.actions";
import CredentialsSignInForm from "@/app/(auth)/sign-in/credentials-signin-form";
import { toast } from "sonner";

export default function CheckOutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGuestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const res = await updateCartGuestEmail(email);

    if (res.success) {
      toast.success(res.message);
      router.push("/check-out/shipping");
    } else {
      setLoading(false);
      toast.error(res.message);
    }
  };

  return (
    <Card className="bg-zinc-950 border-white/5 rounded-lg md:p-6 animate-in fade-in duration-500">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Guest Section */}
          <div className="p-8 md:p-12 space-y-6">
            <CardHeader className="p-0 space-y-2">
              <CardTitle className="text-[#c5a059] text-md tracking-[0.2em] font-bold">
                ΕΠΙΣΚΕΠΤΗΣ
              </CardTitle>
            </CardHeader>

            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] text-neutral-500 tracking-widest font-bold">
                  EMAIL ADDRESS
                </Label>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="bg-black border-white/10 h-12 rounded-lg text-white focus-visible:ring-[#c5a059]"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-neutral-200 tracking-widest text-xs font-bold h-12 rounded-lg"
              >
                {loading ? "ΠΕΡΙΜΕΝΕΤΕ..." : "ΣΥΝΕΧΕΙΑ ΩΣ ΕΠΙΣΚΕΠΤΗΣ"}
              </Button>
            </form>
          </div>

          {/* Member Section */}
          <div className="p-8 md:p-12 space-y-6 bg-zinc-900/20 md:border-l md:border-white/5">
            <CardHeader className="p-0 space-y-2">
              <CardTitle className="text-[#c5a059] text-md tracking-[0.2em] font-bold uppercase">
                ΣΥΝΔΕΣΗ
              </CardTitle>
            </CardHeader>

            <CredentialsSignInForm />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
