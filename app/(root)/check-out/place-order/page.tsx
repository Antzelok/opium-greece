import { Metadata } from "next";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/components/shared/checkout-steps";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CartItem, ShippingAddress } from "@/types";
import PlaceOrderForm from "./place-order-form";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review Order",
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const session = await auth();
  const userId = session?.user?.id;
  const isGuest = !userId && cart.guestEmail;


  if (!userId && !isGuest) redirect("/sign-in");

  const dbUser = userId ? await getUserById(userId) : null;

  const shippingAddress = (cart.shippingAddress || dbUser?.address) as unknown as ShippingAddress;

  if (!shippingAddress || !shippingAddress.shippingMethod) {
    redirect("/check-out/shipping-address");
  }

 
const chosenPaymentMethod = cart.paymentMethod || dbUser?.paymentMethod || "COD";

  let stripeClientSecret: string | null = null;
  let stripePaymentIntentId: string | null = null;

  if (chosenPaymentMethod === "Stripe") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Math.round(Number(cart.totalPrice) * 100),
        currency: "eur",
        automatic_payment_methods: { enabled: true },
        metadata: { orderId: "" },
      },
    );
    stripeClientSecret = paymentIntent.client_secret;
    stripePaymentIntentId = paymentIntent.id;
  }

  return (
    <div className="space-y-10 bg-black text-white w-full pr-0 lg:pr-6">
      <CheckoutSteps current={3} />

      {/* Στοιχεία Αποστολής */}
      <Card className="bg-zinc-950 border-white/5 rounded-none p-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em] italic">
            Στοιχεία Αποστολής
          </CardTitle>
          <CardDescription className="text-zinc-500 text-xs mt-1">
            Παρακαλώ επιβεβαιώστε τη διεύθυνση παράδοσης.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-4 text-zinc-300 pt-0">
          <Separator className="bg-white/5 mb-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 leading-relaxed">
            <p>
              <span className="text-zinc-500 font-medium block text-[10px] uppercase tracking-wider mb-0.5">
                Όνομα
              </span>
              <span className="text-white font-medium">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </span>
            </p>
            <p>
              <span className="text-zinc-500 font-medium block text-[10px] uppercase tracking-wider mb-0.5">
                Τηλέφωνο
              </span>
              <span className="text-white font-medium">
                {shippingAddress.phoneNumber}
              </span>
            </p>
            <p>
              <span className="text-zinc-500 font-medium block text-[10px] uppercase tracking-wider mb-0.5">
                Email
              </span>
              <span className="text-white font-medium">
                {shippingAddress.email || cart.guestEmail}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-zinc-500 text-xs uppercase tracking-wider">
              Μέθοδος:
            </span>
            <Badge
              variant="outline"
              className="border-[#c5a059]/30 text-[#c5a059] font-bold uppercase bg-[#c5a059]/5 px-3 py-1 text-xs tracking-wider rounded-none"
            >
              {shippingAddress.shippingMethod}
            </Badge>
          </div>

          <Separator className="bg-white/5 my-4" />

          {shippingAddress.shippingMethod.toLowerCase() === "elta" ? (
            <div className="bg-zinc-900/20 p-4 border border-white/5 space-y-1">
              <span className="text-zinc-500 font-semibold block text-[10px] uppercase tracking-wider mb-1">
                Διεύθυνση Παράδοσης
              </span>
              <p className="text-white text-sm leading-relaxed">
                {shippingAddress.streetName} {shippingAddress.streetNumber},{" "}
                {shippingAddress.postalCode}
              </p>
            </div>
          ) : (
            <div className="bg-zinc-900/20 p-4 border border-white/5 space-y-2">
              <span className="text-zinc-500 font-semibold block text-[10px] uppercase tracking-wider mb-1">
                Θυρίδα BoxNow
              </span>
              <p className="font-mono text-sm text-white bg-black px-3 py-2 border border-white/5 inline-block">
                {shippingAddress.boxnowLockerId}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Αντικείμενα Παραγγελίας */}
      <Card className="bg-zinc-950 border-white/5 rounded-none p-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em] italic">
            Αντικείμενα Παραγγελίας
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-6">
            {(cart.items as CartItem[]).map((item) => (
              <div key={item.variantId} className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-5">
                    <div className="relative w-16 h-16 bg-zinc-900 border border-white/5 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-white uppercase tracking-wide">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        <span className="text-xs text-zinc-500 self-center font-medium pl-1">
                          x{item.qty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="bg-white/5 last:hidden" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Φόρμα Ολοκλήρωσης */}
      <Card className="bg-zinc-950 border-white/5 rounded-none p-2">
        <CardContent className="pt-6">
          <PlaceOrderForm
            paymentMethod={chosenPaymentMethod}
            stripeClientSecret={stripeClientSecret}
            stripePaymentIntentId={stripePaymentIntentId}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceOrderPage;