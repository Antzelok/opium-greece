"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";

const PaymentMethodForm = ({
  shippingMethod,
  currentPaymentMethod,
}: {
  shippingMethod: string;
  currentPaymentMethod: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [method, setMethod] = useState(
    currentPaymentMethod || (shippingMethod === "boxnow" ? "Stripe" : "COD"),
  );

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
        <label
          className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${method === "Stripe" ? "border-[#c5a059] bg-zinc-900/40" : "border-white/5 bg-transparent"}`}
        >
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="paymentMethod"
              value="Stripe"
              checked={method === "Stripe"}
              onChange={(e) => setMethod(e.target.value)}
              className="accent-[#c5a059]"
            />
            <div>
              <span className="text-white text-xs font-bold uppercase tracking-wider block">
                Credit / Debit Card
              </span>
              <span className="text-neutral-500 text-[10px] tracking-wide block mt-0.5">
                Pay securely with Stripe, Apple Pay or Google Pay
              </span>
            </div>
          </div>
        </label>

        {shippingMethod === "elta" && (
          <label
            className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${method === "COD" ? "border-[#c5a059] bg-zinc-900/40" : "border-white/5 bg-transparent"}`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={method === "COD"}
                onChange={(e) => setMethod(e.target.value)}
                className="accent-[#c5a059]"
              />
              <div>
                <span className="text-white text-xs font-bold uppercase tracking-wider block">
                  Cash On Delivery (Αντικαταβολή)
                </span>
                <span className="text-neutral-500 text-[10px] tracking-wide block mt-0.5">
                  Pay with cash upon delivery (+ courier fees)
                </span>
              </div>
            </div>
          </label>
        )}
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
