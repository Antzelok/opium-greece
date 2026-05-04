"use client";

import React, { useState, useTransition } from "react";
import { HiPlus, HiMinus, HiCheck } from "react-icons/hi";
import { MdOutlineShoppingBag } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product, Cart, CartItem } from "@/types";
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

  // Get primary type (most common) - for "Select Size"
  const primaryType =
    product.variants.length > 0 ? product.variants[0].type : "Perfume";

  // Group variants by type
  const sizeVariants = product.variants.filter((v) => v.type === primaryType);
  const extrasVariants = product.variants.filter((v) => v.type !== primaryType);

  // Toggle variant selection
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

  // Calculate total price
  const totalPrice = Array.from(selectedVariants).reduce((sum, variantId) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return sum;
    return sum + Number(variant.price) * quantity;
  }, 0);

  // handle add to cart
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
        // Ensure variant exists and has required fields
        if (!variant || !product.images?.[0]) return null;

        return {
          variantId: variant.id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          category: product.category,
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
        toast.error(res.message, {
          style: {
            background: "#0A0A0A",
            color: "#C5A25D",
            border: "1px solid #C5A25D",
          },
        });
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

      // Reset selections
      setSelectedVariants(new Set());
      setQuantity(1);
    });
  };

  return (
    <div className="flex flex-col space-y-10">
      {/* Title & Description */}
      <div>
        <h2 className="text-6xl font-serif mb-6 tracking-tight">
          {product.name}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
          {product.description}
        </p>
      </div>

      {/* Size Selection */}
      <div className="space-y-4">
        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-semibold">
          Select Size
        </span>
        <div className="grid grid-cols-3 gap-3">
          {sizeVariants.map((variant) => {
            const isSelected = selectedVariants.has(variant.id);
            return (
              <button
                key={variant.id}
                onClick={() => toggleVariant(variant.id)}
                disabled={isPending}
                className={cn(
                  "flex flex-col items-center py-4 border transition-all disabled:opacity-50",
                  isSelected
                    ? "border-[#c5a059] bg-[#c5a059]/5"
                    : "border-white/10 hover:border-white/30 bg-transparent",
                )}
              >
                <span className="text-xs font-medium">{variant.size}</span>
                <span className="text-[#c5a059] text-[10px] mt-1">
                  €{Number(variant.price).toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Complete Your Set */}
      {extrasVariants.length > 0 && (
        <div className="space-y-4">
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-semibold">
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
                  className="w-full flex items-center justify-between py-4 group transition-all disabled:opacity-50"
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
                      {active && <HiCheck className="text-black text-xs" />}
                    </div>
                    <div className="text-left">
                      <span
                        className={cn(
                          "text-sm transition-colors",
                          active
                            ? "text-white"
                            : "text-gray-400 group-hover:text-white",
                        )}
                      >
                        {variant.type}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {variant.size}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-medium transition-colors",
                      active ? "text-[#c5a059]" : "text-gray-600",
                    )}
                  >
                    +€{Number(variant.price).toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer: Quantity & Add to Cart */}
      <div className="pt-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-white/5 border border-white/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isPending}
              className="p-3 hover:text-[#c5a059] transition-colors disabled:opacity-50"
            >
              <HiMinus size={14} />
            </button>
            <span className="w-12 text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={isPending}
              className="p-3 hover:text-[#c5a059] transition-colors disabled:opacity-50"
            >
              <HiPlus size={14} />
            </button>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-widest text-gray-500 uppercase mb-1">
              Total Price
            </p>
            <p className="text-4xl font-serif text-[#c5a059]">
              €{totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isPending || selectedVariants.size === 0}
          className="w-full h-16 bg-[#c5a059] hover:bg-[#b08e4d] disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-none flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
        >
          <MdOutlineShoppingBag size={20} />
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase">
            {isPending
              ? "Adding..."
              : `Add to Cart — €${totalPrice.toFixed(2)}`}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
