"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { updateCartPaymentMethod } from "@/lib/actions/cart.actions";
import { toast } from "sonner";
import { FaTruckFast, FaRegCreditCard } from "react-icons/fa6";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await updateCartPaymentMethod(selectedMethod);

      if (res.success) {
        toast.success(res.message);
        router.push("/check-out/place-order");
      } else {
        toast.error(res.message || "Κάτι πήγε στραβά.");
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
          <div className="flex items-center space-x-3 space-y-0 p-5 border border-white/5 bg-black rounded-none cursor-pointer [&:has([data-state=checked])]:border-[#c5a059]">
            <RadioGroupItem
              value="COD"
              id="COD"
              className="border-zinc-700 text-[#c5a059] focus-visible:ring-[#c5a059]"
            />
            <Label
              htmlFor="COD"
              className="flex items-center gap-4 cursor-pointer w-full"
            >
              <FaTruckFast className="w-5 h-5 text-zinc-400" />
              <div>
                <span className="text-white text-xs font-bold uppercase tracking-wider block">
                  Αντικαταβολή (COD)
                </span>
                <span className="text-zinc-500 text-[11px] block mt-0.5">
                  Πληρωμή με μετρητά κατά την παράδοση (+2.50€).
                </span>
              </div>
            </Label>
          </div>
        )}

        {allowedMethods.includes("Stripe") && (
          <div className="flex items-center space-x-3 space-y-0 p-5 border border-white/5 bg-black rounded-none cursor-pointer [&:has([data-state=checked])]:border-[#c5a059]">
            <RadioGroupItem
              value="Stripe"
              id="Stripe"
              className="border-zinc-700 text-[#c5a059] focus-visible:ring-[#c5a059]"
            />
            <Label
              htmlFor="Stripe"
              className="flex items-center gap-4 cursor-pointer w-full"
            >
              <FaRegCreditCard className="w-5 h-5 text-zinc-400" />
              <div>
                <span className="text-white text-xs font-bold uppercase tracking-wider block">
                  Ηλεκτρονική Πληρωμή (Stripe)
                </span>
                <span className="text-zinc-500 text-[11px] block mt-0.5">
                  Πιστωτική/Χρεωστική Κάρτα, Apple Pay, Google Pay, Revolut Pay.
                </span>
              </div>
            </Label>
          </div>
        )}
      </RadioGroup>

      {!isElta && (
        <p className="text-zinc-500 text-[11px] italic">
          * Η αντικαταβολή δεν είναι διαθέσιμη για αποστολές με BoxNow.
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#c5a059] text-black font-black text-[10px] tracking-[0.25em] hover:bg-white hover:text-black h-14 rounded-none transition-all uppercase shadow-none mt-6"
      >
        {isPending ? "ΕΠΕΞΕΡΓΑΣΙΑ..." : "ΣΥΝΕΧΕΙΑ"}
      </Button>
    </form>
  );
};

export default PaymentMethodForm;