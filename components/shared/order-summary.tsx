import { getMyCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";

const OrderSummary = async () => {
  const cart = await getMyCart();
  const items = cart?.items || [];

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0,
  );

  const shippingPrice = cart?.shippingPrice ? Number(cart.shippingPrice) : 0;
  const totalPrice = cart?.totalPrice ? Number(cart.totalPrice) : subtotal;

  return (
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

          {shippingPrice >= 0 && (
            <div className="flex justify-between items-center text-neutral-500 text-[11px] uppercase tracking-widest mt-2">
              <span>Shipping</span>
              <span className="text-white font-mono">
                {formatCurrency(shippingPrice)}
              </span>
            </div>
          )}

          <div className="h-px bg-white/5 my-6" />

          <div className="flex justify-between items-end pt-2">
            <span className="text-white text-[11px] font-black tracking-[0.2em]">
              TOTAL
            </span>
            <span className="text-[#c5a059] text-3xl font-serif tracking-tighter">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;
