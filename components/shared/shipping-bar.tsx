"use client";

import { useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

const ShippingBar = ({ subtotal }: { subtotal: number }) => {
  const searchParams = useSearchParams();
  const hasShipping = searchParams.get("shipping") === "true";
  const finalTotal = hasShipping ? subtotal + 2.0 : subtotal;

  return (
    <div className="flex justify-between items-end pt-2">
      <div className="flex items-center gap-2">
        <span className="text-white text-[11px] font-black tracking-[0.2em]">
          TOTAL
        </span>
        {hasShipping && (
          <span className="text-[9px] font-mono bg-[#c5a059]/10 text-[#c5a059] px-1.5 py-0.5 border border-[#c5a059]/20 animate-in fade-in duration-200">
            +€2.00
          </span>
        )}
      </div>
      <span className="text-[#c5a059] text-3xl font-serif tracking-tighter">
        {formatCurrency(finalTotal)}
      </span>
    </div>
  );
};

export default ShippingBar;
