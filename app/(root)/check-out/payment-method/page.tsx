import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import CheckoutSteps from "@/components/shared/checkout-steps";
import PaymentMethodForm from "./payment-method-form";
import { Metadata } from "next";
import { PAYMENT_METHODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Payment Method`,
};

const PaymentMethodPage = async () => {
  const session = await auth();
  if (!session || !session.user?.id) redirect("/sign-in");

  const user = await getUserById(session.user.id!);

  const shippingMethod =
    (user.address as { shippingMethod?: string })?.shippingMethod || "Stripe";

  return (
    <div className="space-y-8">
      <CheckoutSteps current={2} />

      <div className="bg-zinc-950 border border-white/5 p-8 rounded-none">
        <h2 className="text-[#c5a059] tracking-[0.2em] text-[10px] font-bold mb-8 uppercase">
          Select Payment Method
        </h2>

        <PaymentMethodForm
          shippingMethod={shippingMethod}
          currentPaymentMethod={user.paymentMethod || ""}
          allowedMethods={PAYMENT_METHODS}
        />
      </div>
    </div>
  );
};

export default PaymentMethodPage;
