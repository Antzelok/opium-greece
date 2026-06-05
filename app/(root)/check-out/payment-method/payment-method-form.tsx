"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";

const METHOD_CONFIG: Record<
  string,
  { value: string; title: string; sub: string }
> = {
  Stripe: {
    value: "Stripe",
    title: "Χρεωστική / Πιστωτική Κάρτα",
    sub: "Πληρωμή με Visa, Mastercard ή άλλη κάρτα μέσω Stripe",
  },
  "Apple Pay / Google Pay": {
    value: "DigitalWallet",
    title: "Apple Pay / Google Pay",
    sub: "Γρήγορη και ασφαλής πληρωμή μέσω του ψηφιακού σας πορτοφολιού",
  },
  "Cash On Delivery": {
    value: "COD",
    title: "Αντικαταβολή",
    sub: "Πληρωμή με μετρητά κατά την παράδοση",
  },
};

const PaymentMethodForm = ({
  shippingMethod,
  currentPaymentMethod,
  allowedMethods,
}: {
  shippingMethod: string;
  currentPaymentMethod: string;
  allowedMethods: string[];
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [method, setMethod] = useState(() => {
    if (currentPaymentMethod) return currentPaymentMethod;
    return shippingMethod === "Apple Pay / Google Pay" ? "Stripe" : "COD";
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateUserPaymentMethod({ type: method });
      router.push("/place-order");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {allowedMethods.map((rawMethod) => {
          const config = METHOD_CONFIG[rawMethod];
          if (!config) return null;

          if (config.value === "COD" && shippingMethod === "boxnow") {
            return null;
          }

          return (
            <label
              key={config.value}
              className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                method === config.value
                  ? "border-[#c5a059] bg-zinc-900/40"
                  : "border-white/5 bg-transparent"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={config.value}
                  checked={method === config.value}
                  onChange={(e) => setMethod(e.target.value)}
                  className="accent-[#c5a059]"
                />
                <div>
                  <span className="text-white text-xs font-bold uppercase tracking-wider block">
                    {config.title}
                  </span>
                  <span className="text-neutral-500 text-[10px] tracking-wide block mt-0.5">
                    {config.sub}
                  </span>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#c5a059] text-black py-4 rounded-none text-[11px] font-black tracking-[0.3em] hover:bg-white transition-all uppercase disabled:opacity-50 mt-8"
      >
        {isPending ? "Saving..." : "CONTINUE TO REVIEW"}
      </button>
    </form>
  );
};

export default PaymentMethodForm;
