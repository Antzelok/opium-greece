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
import { formatCurrency } from "@/lib/utils";

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
        className="w-full sm:max-w-md bg-[#0A0A0A] border-l border-white/5 p-0 flex flex-col outline-none shadow-2xl"
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
            <HiOutlineShoppingCart className="h-6 w-6 text-[#C5A25D]" />
            <h2 className="text-white text-[12px] font-bold tracking-[0.2em]">
              YOUR CART{" "}
              <span className="text-zinc-400 ml-1 font-light">
                ({itemCount})
              </span>
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-zinc-400 hover:text-white transition-colors outline-none p-1"
          >
            <RiCloseLine className="h-6! w-6!" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center pb-12">
              <RiShoppingBag3Line className="h-12 w-12 text-neutral-600 mb-4 font-light" />
              <h3 className="text-white text-sm tracking-widest font-light mb-2">
                CART IS EMPTY
              </h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Discover our exclusive fragrance collection
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {items.map((item) => (
                <div key={item.variantId} className="py-8 flex gap-6 group">
                  {/* Item Image */}
                  <div className="relative h-32 w-20 bg-[#111] shrink-0 border border-white/5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <h4 className="text-[#C5A25D] text-[11px] uppercase tracking-[0.15em] font-medium leading-tight">
                          {item.name}
                        </h4>

                        <div className="flex items-center gap-2">
                          <span className="text-[#C5A25D] text-[10px] border border-[#C5A25D]/20 px-1.5 py-0.5 rounded-sm uppercase tracking-widest font-bold">
                            {item.size}
                          </span>
                          <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-light">
                            {item.type}
                          </span>
                        </div>

                        <p className="text-zinc-400 text-[10px] uppercase tracking-widest">
                          {item.brand}
                        </p>
                      </div>
                      <p className="text-white text-xs font-mono font-light">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-white/10 bg-black">
                        <button
                          disabled={isPending}
                          onClick={() => handleUpdateQty(item, "remove")}
                          className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors disabled:opacity-20"
                        >
                          <RiSubtractLine className="h-3 w-3" />
                        </button>
                        <span className="text-[10px] text-white w-8 text-center font-mono">
                          {isPending ? ".." : item.qty}
                        </span>
                        <button
                          disabled={isPending}
                          onClick={() => handleUpdateQty(item, "add")}
                          className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors disabled:opacity-20"
                        >
                          <RiAddLine className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-[12px] text-zinc-400 font-light italic">
                        {formatCurrency(Number(item.price) * item.qty)}
                      </span>
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
              <div className="flex flex-col">
                <span className="text-zinc-400 text-[10px] tracking-[0.2em] font-bold">
                  TOTAL AMOUNT
                </span>
                <span className="text-zinc-400 text-[9px] tracking-widest mt-0.5">
                  VAT INCLUDED*
                </span>
              </div>
              <span className="text-[#C5A25D] text-xl font-serif tracking-tighter">
                {formatCurrency(cart?.itemsPrice || 0)}
              </span>
            </div>

            <Button
              asChild
              onClick={() => setOpen(false)}
              className="w-full bg-[#C5A25D] text-black hover:bg-[#b08e4d] rounded-sm h-14 text-[11px] font-black tracking-[0.3em] transition-all"
            >
              <Link href={cart?.userId ? "/check-out/shipping" : "/check-out"}>
                SECURE CHECKOUT
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
