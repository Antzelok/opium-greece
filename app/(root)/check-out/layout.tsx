import { Suspense } from "react";
import { getMyCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import ShippingBar from "@/components/shared/shipping-bar";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch the cart directly from the database
  const cart = await getMyCart();
  const items = cart?.items || [];

  // 2. Calculate the subtotal of the items
  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0,
  );

  // 3. Get shipping and total prices directly from the cart model
  const shippingPrice = cart?.shippingPrice ? Number(cart.shippingPrice) : 0;
  const totalPrice = cart?.totalPrice ? Number(cart.totalPrice) : subtotal;

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
              {/* Subtotal row */}
              <div className="flex justify-between items-center text-neutral-500 text-[11px] uppercase tracking-widest">
                <span>Subtotal ({items.length} items)</span>
                <span className="text-white font-mono">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {/* Dynamic Shipping row fetched from DB */}
              {shippingPrice > 0 && (
                <div className="flex justify-between items-center text-neutral-500 text-[11px] uppercase tracking-widest mt-2">
                  <span>Shipping</span>
                  <span className="text-white font-mono">
                    {formatCurrency(shippingPrice)}
                  </span>
                </div>
              )}

              <div className="h-px bg-white/5 my-6" />

              {/* Total Component */}
              <Suspense
                fallback={
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-white text-[11px] font-black tracking-[0.2em]">
                      TOTAL
                    </span>
                    <span className="text-[#c5a059] text-3xl font-serif tracking-tighter">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                }
              >
                {/* Pass the verified database prices to the client component */}
                <ShippingBar total={totalPrice} shippingPrice={shippingPrice} />
              </Suspense>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
