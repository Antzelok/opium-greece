"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { updateCartPaymentMethod } from "@/lib/actions/cart.actions";
import { toast } from "sonner";
import { FaTruckFast, FaRegCreditCard } from "react-icons/fa6";
import { Spinner } from "@/components/ui/spinner";

interface FormProps {
  shippingMethod: string;
  currentPaymentMethod: string;
  allowedMethods: string[];
}

const PaymentMethodForm = ({
  shippingMethod,
  currentPaymentMethod,
  allowedMethods,
}: FormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isElta = shippingMethod.toLowerCase() === "elta";
  const defaultMethod = isElta ? currentPaymentMethod || "COD" : "Stripe";

  const [selectedMethod, setSelectedMethod] = useState<string>(defaultMethod);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await updateCartPaymentMethod(selectedMethod);

      if (res.success) {
        router.push("/check-out/place-order");
      } else {
        toast.error(res.message || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RadioGroup
        value={selectedMethod}
        onValueChange={setSelectedMethod}
        className="space-y-4"
      >
        {isElta && allowedMethods.includes("COD") && (
          <div className="flex items-center space-x-3 space-y-0 p-5 border border-zinc-800 rounded-md cursor-pointer has-data-[state=checked]:border-[#c5a059]">
            <RadioGroupItem
              value="COD"
              id="COD"
              className="border-zinc-400 text-[#c5a059] focus-visible:ring-[#c5a059]"
            />
            <Label
              htmlFor="COD"
              className="flex items-center gap-4 cursor-pointer w-full"
            >
              <FaTruckFast className="w-5 h-5 text-zinc-400" />
              <div>
                <span className="text-white text-xs font-bold tracking-wider block">
                  CASH ON DELIVERY
                </span>
                <span className="text-zinc-400 text-[12px] block mt-0.5">
                  Cash payment upon delivery (+2.00€).
                </span>
              </div>
            </Label>
          </div>
        )}

        {allowedMethods.includes("Stripe") && (
          <div className="flex items-center space-x-3 space-y-0 p-5 border border-zinc-800 rounded-md cursor-pointer has-data-[state=checked]:border-[#c5a059]">
            <RadioGroupItem
              value="Stripe"
              id="Stripe"
              className="border-zinc-400 text-[#c5a059] focus-visible:ring-[#c5a059]"
            />
            <Label
              htmlFor="Stripe"
              className="flex items-center gap-4 cursor-pointer w-full"
            >
              <FaRegCreditCard className="w-5 h-5 text-zinc-400" />
              <div>
                <span className="text-white text-xs font-bold tracking-wider block">
                  ONLINE PAYMENT
                </span>
                <span className="text-zinc-400 text-[12px] block mt-0.5">
                  Credit/Debit Card, Apple Pay, Google Pay, Revolut Pay, Klarna
                  (+2.00€).
                </span>
              </div>
            </Label>
          </div>
        )}
      </RadioGroup>

      {!isElta && (
        <p className="text-zinc-400 text-[12px] italic">
          * Cash on Delivery is not available for BoxNow shipments.
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#C5A25D] text-black font-black text-[11px] tracking-[0.25em] hover:bg-[#b08e4d] hover:text-black h-14 rounded-md transition-all shadow-none mt-6"
      >
        {isPending ? <Spinner /> : "CONTINUE"}
      </Button>
    </form>
  );
};

export default PaymentMethodForm;
