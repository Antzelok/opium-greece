import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

const ProductCard = ({ product }: { product: Product }) => {
  const firstVariant =
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null;

  return (
    <Card className="w-full max-w-sm border-none shadow-lg bg-[#0A0A0A] group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#C5A25D]/10">
      <CardHeader className="p-0 relative overflow-hidden">
        {/* Category Badge - Luxury Style */}
        <Badge className="absolute top-3 left-3 z-10 bg-[#C5A25D] text-black hover:bg-[#b39154] uppercase text-[8px] tracking-[0.15em] font-black border-none rounded-none px-3 py-1">
          {product.category}
        </Badge>

        <Link
          href={`/product/${product.slug}`}
          className="w-full block overflow-hidden"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            height={500}
            width={500}
            priority={true}
            className="object-cover w-full aspect-4/5 opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
          />
          {/* Subtle Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
      </CardHeader>

      <CardContent className="p-5 grid gap-2 text-center">
        {/* Brand - Gold Accent */}
        <div className="text-[#C5A25D] text-[9px] uppercase tracking-[0.3em] font-semibold">
          {product.brand}
        </div>

        {/* Product Name - White & Elegant */}
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-white text-base font-light tracking-wide hover:text-[#C5A25D] transition-colors duration-300 uppercase">
            {product.name}
          </h2>
        </Link>

        {/* Price & Variant Info */}
        <div className="mt-2 flex flex-col items-center gap-1">
          {firstVariant ? (
            <>
              <div className="text-[#C5A25D]">
                <ProductPrice
                  value={Number(firstVariant.price)}
                  className="text-lg font-medium tracking-tighter"
                />
              </div>

              {/* Variant Details */}
              <div className="flex items-center gap-2 text-[8px] text-gray-500 tracking-[0.2em] uppercase mt-1">
                <span>{firstVariant.type}</span>
                {firstVariant.name && (
                  <>
                    <span className="w-1 h-1 bg-[#C5A25D] rounded-full" />
                    <span>{firstVariant.name}</span>
                  </>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase font-bold italic">
              Currently Unavailable
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
