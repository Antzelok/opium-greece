"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  RiShoppingBag3Line,
  RiCloseLine,
  RiAddLine,
  RiSubtractLine,
} from "react-icons/ri";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Cart, CartItem } from "@/types";
import { AddItemToCart, RemoveItemFromCart } from "@/lib/actions/cart.actions";

const CartDrawer = ({ cart }: { cart?: Cart }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const items = cart?.items || [];
  const itemCount = items.reduce((acc, item) => acc + item.qty, 0);

  const handleUpdateQty = (item: CartItem, action: "add" | "remove") => {
    startTransition(async () => {
      const res =
        action === "add"
          ? await AddItemToCart(item)
          : await RemoveItemFromCart(item.variantId);

      if (res.success) {
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-neutral-200 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-0"
        >
          <RiShoppingBag3Line className="h-6! w-6!" />
          {itemCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A25D]"></span>
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-110 bg-[#0A0A0A] border-l border-white/5 p-0 flex flex-col outline-none shadow-2xl"
      >
        <div className="sr-only">
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            Review your items and total price before checkout.
          </SheetDescription>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-7 border-b border-white/5">
          <div className="flex items-center gap-3">
            <HiOutlineShoppingCart className="h-5 w-5 text-[#C5A25D]" />
            <h2 className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">
              Your Cart{" "}
              <span className="text-neutral-500 ml-1 font-light">
                ({itemCount})
              </span>
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-neutral-500 hover:text-white transition-colors outline-none p-1"
          >
            <RiCloseLine className="h-6! w-6!" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center pb-12">
              <RiShoppingBag3Line className="h-12 w-12 text-neutral-800 mb-4 font-light" />
              <h3 className="text-white text-sm uppercase tracking-widest font-light mb-2">
                Cart is empty
              </h3>
              <p className="text-neutral-600 text-[11px] leading-relaxed">
                Discover our exclusive fragrance collection
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {items.map((item) => (
                <div key={item.variantId} className="py-8 flex gap-6 group">
                  <div className="relative h-28 w-20 bg-[#111] shrink-0 border border-white/5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-white text-[11px] uppercase tracking-[0.15em] font-medium leading-tight mb-1">
                          {item.name}
                        </h4>
                        <p className="text-[#C5A25D] text-[9px] uppercase tracking-widest italic">
                          {item.category}
                        </p>
                      </div>
                      <p className="text-white text-xs font-light">
                        €{item.price}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-white/10 bg-black">
                        <button
                          disabled={isPending}
                          onClick={() => handleUpdateQty(item, "remove")}
                          className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-white transition-colors disabled:opacity-20"
                        >
                          <RiSubtractLine className="h-4 w-4" />
                        </button>
                        <span className="text-[10px] text-white w-8 text-center font-mono">
                          {isPending ? "..." : item.qty}
                        </span>
                        <button
                          disabled={isPending}
                          onClick={() => handleUpdateQty(item, "add")}
                          className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-white transition-colors disabled:opacity-20"
                        >
                          <RiAddLine className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 border-t border-white/5 bg-[#0D0D0D]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-light">
                Subtotal
              </span>
              <span className="text-white text-sm font-medium italic tracking-tighter">
                €{cart?.itemsPrice}
              </span>
            </div>
            <Button
              asChild
              onClick={() => setOpen(false)}
              className="w-full bg-white text-black hover:bg-neutral-200 rounded-none h-12 uppercase text-[11px] font-bold tracking-[0.25em] transition-all"
            >
              <Link href="/checkout">Secure Checkout</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
