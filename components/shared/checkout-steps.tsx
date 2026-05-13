import React from "react";
import { cn } from "@/lib/utils";

const CheckoutSteps = ({ current = 0 }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
      {["Account", "Shipping Address", "Payment Method", "Place Order"].map(
        (step, index) => (
          <React.Fragment key={step}>
            <div
              className={cn(
                "px-6 py-2 w-full md:w-auto min-w-48 rounded-md text-center text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border",
                index === current
                  ? "bg-[#c5a059] text-black border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                  : index < current
                    ? "text-[#c5a059] border-[#c5a059]/30 bg-black"
                    : "text-neutral-500 border-white/10 bg-black/40",
              )}
            >
              {step}
            </div>

            {step !== "Place Order" && (
              <div className="hidden md:block w-8 h-px bg-white/10" />
            )}
          </React.Fragment>
        ),
      )}
    </div>
  );
};

export default CheckoutSteps;
