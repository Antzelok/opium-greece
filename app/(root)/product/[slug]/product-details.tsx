"use client";

import { useState, useTransition } from "react";
import { HiPlus, HiMinus, HiCheck } from "react-icons/hi";
import { MdOutlineShoppingBag } from "react-icons/md";
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

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(
    new Set(),
  );

  // Διαχωρισμός variants (π.χ. Perfumes vs Samples/Extras)
  const primaryType =
    product.variants.length > 0 ? product.variants[0].type : "Perfume";
  const sizeVariants = product.variants.filter((v) => v.type === primaryType);
  const extrasVariants = product.variants.filter((v) => v.type !== primaryType);

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

  const totalPrice = Array.from(selectedVariants).reduce((sum, variantId) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return sum;
    return sum + Number(variant.price) * quantity;
  }, 0);

  const handleAddToCart = async () => {
    if (selectedVariants.size === 0) {
      toast.error("Please select at least one size", {
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
      toast.success(res.message);
      router.refresh();
      setSelectedVariants(new Set());
      setQuantity(1);
    });
  };

  return (
    <div className="flex flex-col space-y-8 md:space-y-10">
      {/* Title & Description */}
      <div className="space-y-4">
        <h2 className="text-4xl md:text-6xl font-serif tracking-tight leading-tight">
          {product.name}
        </h2>
        <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-md italic">
          {product.description}
        </p>
      </div>

      {/* Size Selection */}
      <div className="space-y-4">
        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold">
          Select Size
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
          {sizeVariants.map((variant) => {
            const isSelected = selectedVariants.has(variant.id);
            return (
              <button
                key={variant.id}
                onClick={() => toggleVariant(variant.id)}
                disabled={isPending}
                className={cn(
                  "flex flex-col items-center py-3 md:py-4 border transition-all duration-300",
                  isSelected
                    ? "border-[#c5a059] bg-[#c5a059]/10 text-white shadow-[0_0_15px_rgba(197,162,93,0.1)]"
                    : "border-white/10 hover:border-white/30 text-gray-400",
                )}
              >
                <span className="text-[11px] md:text-xs font-medium uppercase tracking-widest">
                  {variant.size}
                </span>
                <span className="text-[#c5a059] text-[9px] md:text-[10px] mt-1 font-mono">
                  {formatCurrency(variant.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Complete Your Set */}
      {extrasVariants.length > 0 && (
        <div className="space-y-4">
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold">
            Complete Your Set
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
                      {active && <HiCheck className="text-black text-[10px]" />}
                    </div>
                    <div className="text-left">
                      <span
                        className={cn(
                          "text-xs md:text-sm transition-colors",
                          active ? "text-white" : "text-gray-400",
                        )}
                      >
                        {variant.type}
                      </span>
                      <p className="text-[10px] text-gray-600 font-mono italic">
                        {variant.size}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] md:text-xs font-mono",
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
          {/* Quantity Selector */}
          <div className="flex items-center bg-white/3 border border-white/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isPending}
              className="p-3 md:p-4 hover:text-[#c5a059] transition-colors"
            >
              <HiMinus size={12} />
            </button>
            <span className="w-8 md:w-10 text-center text-xs font-mono">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={isPending}
              className="p-3 md:p-4 hover:text-[#c5a059] transition-colors"
            >
              <HiPlus size={12} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-[9px] tracking-[0.2em] text-gray-500 uppercase mb-1 font-bold">
              Total Price
            </p>
            <p className="text-3xl md:text-4xl font-serif text-[#c5a059] tabular-nums">
              {formatCurrency(totalPrice)}
            </p>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isPending || selectedVariants.size === 0}
          className="w-full h-14 md:h-16 bg-[#c5a059] hover:bg-[#b08e4d] text-black rounded-none flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
        >
          <MdOutlineShoppingBag size={18} />
          <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase">
            {isPending
              ? "Adding..."
              : `Add to Cart — ${formatCurrency(totalPrice)}`}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
