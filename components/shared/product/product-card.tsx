import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product, Cart } from "@/types";
import { Badge } from "@/components/ui/badge";
import AddToCart from "./add-to-cart";
import { formatCurrency } from "@/lib/utils"; // Εισαγωγή της συνάρτησης

interface ProductCardProps {
  product: Product;
  cart?: Cart;
}

const ProductCard = ({ product, cart }: ProductCardProps) => {
  const firstVariant = product.variants?.[0];

  if (!firstVariant) return null;

  return (
    <Card className="w-full max-w-65 mx-auto border-none shadow-lg bg-[#0A0A0A] group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#C5A25D]/10 rounded-2xl">
      <CardHeader className="p-0 relative overflow-hidden">
        <Badge className="absolute top-2 left-2 z-10 bg-[#C5A25D] text-black uppercase text-[7px] tracking-[0.15em] font-black border-none rounded-none px-2 py-0.5">
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
            priority
            className="object-cover w-full aspect-4/5 opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
          />
        </Link>
      </CardHeader>

      <CardContent className="p-4 grid gap-1 text-center">
        <div className="text-[#C5A25D] text-[8px] uppercase tracking-[0.25em] font-bold">
          {product.brand}
        </div>

        <Link href={`/product/${product.slug}`}>
          <h2 className="text-white text-sm font-light tracking-wide hover:text-[#C5A25D] transition-colors duration-300 uppercase truncate">
            {product.name}
          </h2>
        </Link>

        <div className="mt-1 flex flex-col items-center gap-0.5">
          {/* Αντικατάσταση του ProductPrice με formatCurrency για συνέπεια */}
          <div className="text-[#C5A25D] text-base font-semibold tracking-tighter">
            {formatCurrency(firstVariant.price)}
          </div>

          <div className="flex items-center gap-1.5 text-[7px] text-gray-500 tracking-[0.15em] uppercase mt-0.5 mb-3">
            <span>{firstVariant.type}</span>
          </div>

          <div className="w-full mt-2">
            <AddToCart
              cart={cart}
              item={{
                productId: product.id,
                variantId: firstVariant.id,
                name: product.name,
                slug: product.slug,
                category: product.category,
                image: product.images[0],
                brand: product.brand,
                price: firstVariant.price,
                qty: 1,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
