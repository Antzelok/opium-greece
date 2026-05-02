// components/shared/add-to-cart.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CartItem, Cart } from "@/types";
import { AddItemToCart, RemoveItemFromCart } from "@/lib/actions/cart.actions";
import { Plus, Minus, Loader2 } from "lucide-react";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const existItem = cart?.items.find((x) => x.variantId === item.variantId);

  const handleAction = async (action: "add" | "remove") => {
    startTransition(async () => {
      const res =
        action === "add"
          ? await AddItemToCart(item)
          : await RemoveItemFromCart(item.variantId);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.refresh();
      toast.success(res.message, {
        style: {
          background: "#0A0A0A",
          color: "#C5A25D",
          border: "1px solid #C5A25D",
        },
      });
    });
  };

  return existItem ? (
    <div className="flex items-center justify-between border border-[#C5A25D]/30 bg-black h-11 w-full max-w-35transition-all hover:border-[#C5A25D]">
      <button
        disabled={isPending}
        onClick={() => handleAction("remove")}
        className="flex items-center justify-center w-10 h-full hover:bg-[#C5A25D] hover:text-black transition-colors text-[#C5A25D] disabled:opacity-50"
      >
        <Minus className="h-4 w-4" />
      </button>

      <span className="text-white font-light text-sm">
        {isPending ? (
          <Loader2 className="h-3 w-3 animate-spin text-[#C5A25D]" />
        ) : (
          existItem.qty
        )}
      </span>

      <button
        disabled={isPending}
        onClick={() => handleAction("add")}
        className="flex items-center justify-center w-10 h-full hover:bg-[#C5A25D] hover:text-black transition-colors text-[#C5A25D] disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  ) : (
    <Button
      disabled={isPending}
      onClick={() => handleAction("add")}
      className="w-full h-11 bg-[#C5A25D] hover:bg-[#b39154] text-black rounded-none uppercase text-[10px] font-bold tracking-[0.2em] transition-all duration-300"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add To Cart"}
    </Button>
  );
};

export default AddToCart;
