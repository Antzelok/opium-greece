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
    <Card className="w-full max-w-65 mx-auto border-none shadow-lg bg-[#0A0A0A] group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#C5A25D]/10 rounded-2xl">
      <CardHeader className="p-0 relative overflow-hidden">
        {/* Luxury Category Badge */}
        <Badge className="absolute top-2 left-2 z-10 bg-[#C5A25D] text-black hover:bg-[#b39154] uppercase text-[7px] tracking-[0.15em] font-black border-none rounded-none px-2 py-0.5">
          {product.category}
        </Badge>

        <Link
          href={`/product/${product.slug}`}
          className="w-full block overflow-hidden"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            height={400}
            width={400}
            priority={true}
            className="object-cover w-full aspect-4/5 opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
          />
          {/* Elegant Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 grid gap-1 text-center">
        {/* Brand - Gold Accent */}
        <div className="text-[#C5A25D] text-[8px] uppercase tracking-[0.25em] font-bold">
          {product.brand}
        </div>

        {/* Product Name - Minimal & Clean */}
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-white text-sm font-light tracking-wide hover:text-[#C5A25D] transition-colors duration-300 uppercase truncate">
            {product.name}
          </h2>
        </Link>

        {/* Price & Variant Specs */}
        <div className="mt-1 flex flex-col items-center gap-0.5">
          {firstVariant ? (
            <>
              <div className="text-[#C5A25D]">
                <ProductPrice
                  value={Number(firstVariant.price)}
                  className="text-base font-semibold tracking-tighter"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[7px] text-gray-500 tracking-[0.15em] uppercase mt-0.5 font-medium">
                <span>{firstVariant.type}</span>
                {firstVariant.name && (
                  <>
                    <span className="w-1 h-1 bg-[#C5A25D]/50 rounded-full" />
                    <span>{firstVariant.name}</span>
                  </>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-[9px] tracking-[0.2em] uppercase font-bold italic">
              Out of Stock
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
