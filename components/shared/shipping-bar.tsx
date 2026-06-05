"use client";

import { formatCurrency } from "@/lib/utils";

interface ShippingBarProps {
  total: number;
  shippingPrice: number;
}

const ShippingBar = ({ total, shippingPrice }: ShippingBarProps) => {
  return (
    <div className="flex justify-between items-end pt-2">
      <div className="flex items-center gap-2">
        <span className="text-white text-[11px] font-black tracking-[0.2em]">
          TOTAL
        </span>
        {/* Render badge if a shipping fee is locked in the database */}
        {shippingPrice > 0 && (
          <span className="text-[9px] font-mono bg-[#c5a059]/10 text-[#c5a059] px-1.5 py-0.5 border border-[#c5a059]/20">
            +{formatCurrency(shippingPrice)}
          </span>
        )}
      </div>
      <span className="text-[#c5a059] text-3xl font-serif tracking-tighter">
        {formatCurrency(total)}
      </span>
    </div>
  );
};

export default ShippingBar;
