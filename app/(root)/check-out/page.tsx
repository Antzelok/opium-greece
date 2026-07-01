import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CredentialsSignInForm from "@/app/(auth)/sign-in/credentials-signin-form";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { updateCartGuestEmail } from "@/lib/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CheckOutPage = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/check-out/shipping");
  }

  const handleGuestAction = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const res = await updateCartGuestEmail(email);
    
    if (res.success) {
      redirect("/check-out/shipping");
    }
  };

  return (
    <div className="space-y-10">
      <CheckoutSteps current={0} />

        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* Guest Section */}
            <div className="p-8 md:p-12 space-y-6">
              <CardHeader className="p-0 space-y-2">
                <CardTitle className="text-[#c5a059] text-md tracking-[0.2em] font-bold">
                  ΕΠΙΣΚΕΠΤΗΣ
                </CardTitle>
              </CardHeader>

              {/* Native Server Form: Δεν επηρεάζεται από client redirects */}
              <form action={handleGuestAction} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] text-neutral-500 tracking-widest font-bold">
                    EMAIL ADDRESS
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="bg-black border-white/10 h-12 rounded-none text-white focus-visible:ring-[#c5a059]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-neutral-200 tracking-widest text-xs font-bold h-12 rounded-none"
                >
                  ΣΥΝΕΧΕΙΑ ΩΣ ΕΠΙΣΚΕΠΤΗΣ
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

              <CredentialsSignInForm callbackUrl="/check-out/shipping" />
            </div>

          </div>
        </CardContent>
    </div>
  );
};

export default CheckOutPage;