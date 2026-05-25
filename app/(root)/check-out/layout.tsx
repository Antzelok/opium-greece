import { Suspense } from "react";
import { getMyCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import ShippingBar from "@/components/shared/shipping-bar";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = await getMyCart();
  const items = cart?.items || [];

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0,
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">{children}</div>

        {/* Sidebar Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 bg-zinc-950 border border-white/5 p-8 rounded-none">
            <h3 className="text-[#c5a059] tracking-[0.2em] text-[10px] font-bold mb-8 italic">
              ORDER SUMMARY
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-neutral-500 text-[11px] uppercase tracking-widest">
                <span>Subtotal ({items.length} items)</span>
                <span className="text-white font-mono">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="h-px bg-white/5 my-6" />

              {/* Client Component */}
              <Suspense
                fallback={
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-white text-[11px] font-black tracking-[0.2em]">
                      TOTAL
                    </span>
                    <span className="text-[#c5a059] text-3xl font-serif tracking-tighter">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                }
              >
                <ShippingBar subtotal={subtotal} />
              </Suspense>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
