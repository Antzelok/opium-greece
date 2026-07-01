import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import CheckoutSteps from "@/components/shared/checkout-steps";
import PaymentMethodForm from "./payment-method-form";
import { Metadata } from "next";
import { PAYMENT_METHODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Payment Method`,
};

const PaymentMethodPage = async () => {
  const session = await auth();
  const cart = await getMyCart();

  if (!cart) redirect("/cart");

  const userId = session?.user?.id;
  const isGuest = !userId && cart.guestEmail;

  if (!userId && !isGuest) {
    redirect("/sign-in");
  }

  const user = userId ? await getUserById(userId) : null;

  const shippingMethod =
    (cart?.shippingAddress as { shippingMethod?: string })?.shippingMethod ||
    (user?.address as { shippingMethod?: string })?.shippingMethod;

  if (!shippingMethod) {
    redirect("/check-out/shipping");
  }

  return (
    <div className="space-y-8">
      <CheckoutSteps current={2} />

      <div className="bg-zinc-950 border border-white/5 p-8 rounded-none">
        <h2 className="text-[#c5a059] tracking-[0.2em] text-[10px] font-bold mb-8 uppercase">
          Select Payment Method
        </h2>

        <PaymentMethodForm
          shippingMethod={shippingMethod}
          currentPaymentMethod={user?.paymentMethod || ""}
          allowedMethods={PAYMENT_METHODS}
        />
      </div>
    </div>
  );
};

export default PaymentMethodPage;
