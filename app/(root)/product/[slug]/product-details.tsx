"use client";

import { useState, useTransition } from "react";
import { HiPlus, HiMinus, HiCheck } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { Product, CartItem, Cart } from "@/types";
import { AddMultipleItemsToCart } from "@/lib/actions/cart.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductDetailsProps {
  product: Product;
  cart?: Cart;
}

const ProductDetailsPage = ({ product }: ProductDetailsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(
    new Set(),
  );

  const primaryType =
    product.variants.length > 0 ? product.variants[0].type : "Perfume";
  const sizeVariants = product.variants.filter((v) => v.type === primaryType);
  const extrasVariants = product.variants.filter((v) => v.type !== primaryType);

  const isPerfumeSelected = sizeVariants.some((v) =>
    selectedVariants.has(v.id),
  );

  const toggleVariant = (variantId: string) => {
    setSelectedVariants((prev) => {
      const updated = new Set(prev);
      if (updated.has(variantId)) {
        updated.delete(variantId);
      } else {
        updated.add(variantId);
      }
      return updated;
    });
  };

  const handlePerfumeToggle = () => {
    if (isPerfumeSelected) {
      setSelectedVariants((prev) => {
        const updated = new Set(prev);
        sizeVariants.forEach((v) => updated.delete(v.id));
        return updated;
      });
    } else {
      toggleVariant(sizeVariants[0].id);
    }
  };

  const totalPrice = Array.from(selectedVariants).reduce((sum, variantId) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return sum;
    return sum + Number(variant.price) * quantity;
  }, 0);

  const handleAddToCart = async () => {
    if (selectedVariants.size === 0) {
      toast.error("Please select at least one item", {
        style: {
          background: "#0A0A0A",
          color: "#C5A25D",
          border: "1px solid #C5A25D",
        },
      });
      return;
    }

    const itemsToAdd: CartItem[] = Array.from(selectedVariants)
      .map((variantId) => {
        const variant = product.variants.find((v) => v.id === variantId);
        if (!variant || !product.images?.[0]) return null;

        return {
          variantId: variant.id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          category: product.category,
          type: variant.type,
          size: variant.size,
          image: product.images[0],
          brand: product.brand,
          price: String(variant.price),
          qty: quantity,
        } as CartItem;
      })
      .filter((item): item is CartItem => item !== null);

    startTransition(async () => {
      const res = await AddMultipleItemsToCart(itemsToAdd);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message, {
        style: {
          background: "#0A0A0A",
          color: "#C5A25D",
          border: "1px solid #C5A25D",
        },
      });
      router.refresh();
      setSelectedVariants(new Set());
      setQuantity(1);
    });
  };

  return (
    <div className="flex flex-col space-y-8 md:space-y-10">
      {/* Title & Description */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-4xl text-[#c5a059] font-serif tracking-tight leading-tight">
          {product.name}
        </h2>
        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-md italic">
          {product.description}
        </p>
      </div>

      {/* Main Product Selector (Perfume) */}
      <div className="space-y-4">
        <span className="text-[11px] tracking-[0.2em] text-zinc-400 font-bold">
          THE FRAGRANCE
        </span>
        <button
          onClick={handlePerfumeToggle}
          className={cn(
            "w-full flex items-center justify-between py-5 px-4 border transition-all duration-300 group",
            isPerfumeSelected
              ? "border-[#c5a059] bg-[#c5a059]/5"
              : "border-white/10 hover:border-white/20",
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-5 h-5 border border-white/20 flex items-center justify-center transition-all",
                isPerfumeSelected
                  ? "bg-[#c5a059] border-[#c5a059]"
                  : "group-hover:border-[#c5a059]/50",
              )}
            >
              {isPerfumeSelected && <HiCheck className="text-black text-xs" />}
            </div>
            <span
              className={cn(
                "text-sm uppercase tracking-widest transition-colors",
                isPerfumeSelected ? "text-white" : "text-gray-400",
              )}
            >
              {primaryType}
            </span>
          </div>
          <span className="text-[10px] text-gray-500 italic">
            Starting from {formatCurrency(sizeVariants[0]?.price || 0)}
          </span>
        </button>

        {/* Sub-options: ML Sizes */}
        <div
          className={cn(
            "grid grid-cols-3 gap-2 transition-all duration-500 overflow-hidden",
            isPerfumeSelected
              ? "opacity-100 max-h-40 translate-y-0 mt-4"
              : "opacity-0 max-h-0 -translate-y-2 pointer-events-none",
          )}
        >
          {sizeVariants.map((variant) => {
            const isSelected = selectedVariants.has(variant.id);
            return (
              <button
                key={variant.id}
                onClick={() => toggleVariant(variant.id)}
                className={cn(
                  "flex flex-col items-center py-3 border transition-all duration-300",
                  isSelected
                    ? "border-[#c5a059] bg-[#c5a059]/20 text-white"
                    : "border-white/5 hover:border-white/20 text-gray-500",
                )}
              >
                <span className="text-[10px] font-medium uppercase">
                  {variant.size}
                </span>
                <span className="text-[#c5a059] text-[12px] mt-1 font-mono">
                  {formatCurrency(variant.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Complete Your Set (Extras) */}
      {extrasVariants.length > 0 && (
        <div className="space-y-4">
          <span className="text-[12px] tracking-[0.2em] text-zinc-400 font-bold">
            COMPLETE YOUR SET
          </span>
          <div className="divide-y divide-white/5 border-y border-white/5">
            {extrasVariants.map((variant) => {
              const active = selectedVariants.has(variant.id);
              return (
                <button
                  key={variant.id}
                  onClick={() => toggleVariant(variant.id)}
                  disabled={isPending}
                  className="w-full flex items-center justify-between py-4 group transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-4 h-4 border border-white/20 flex items-center justify-center transition-all",
                        active
                          ? "bg-[#c5a059] border-[#c5a059]"
                          : "group-hover:border-[#c5a059]/50",
                      )}
                    >
                      {active && <HiCheck className="text-black text-[12px]" />}
                    </div>
                    <div className="text-left">
                      <span
                        className={cn(
                          "text-xs transition-colors text-[13px] tracking-wider",
                          active ? "text-white" : "text-gray-400",
                        )}
                      >
                        {variant.type}
                      </span>
                      <p className="text-[12px] text-gray-600 font-mono italic">
                        {variant.size}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[12px] font-mono",
                      active ? "text-[#c5a059]" : "text-gray-600",
                    )}
                  >
                    +{formatCurrency(variant.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer: Quantity & Total */}
      <div className="pt-2 space-y-6">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center bg-white/3 border border-white/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isPending}
              className="p-3 hover:text-[#c5a059] transition-colors"
            >
              <HiMinus size={12} />
            </button>
            <span className="w-8 text-center text-xs font-mono">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={isPending}
              className="p-3 hover:text-[#c5a059] transition-colors"
            >
              <HiPlus size={12} />
            </button>
          </div>
          <div className="text-right">
            <p className="text-[9px] tracking-[0.2em] text-zinc-400 mb-1 font-bold">
              TOTAL PRICE
            </p>
            <p className="text-3xl font-serif text-[#c5a059] tabular-nums">
              {formatCurrency(totalPrice)}
            </p>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isPending || selectedVariants.size === 0}
          className="w-full h-14 bg-[#c5a059] hover:bg-[#b08e4d] text-black rounded-md uppercase text-sm font-bold tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          {isPending
            ? "Adding..."
            : `Add to Cart — ${formatCurrency(totalPrice)}`}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
