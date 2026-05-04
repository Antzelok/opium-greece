import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import Image from "next/image";
import Link from "next/link";
import ProductDetails from "./product-details";
import { Product } from "@/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product ? `${product.name} | Opium` : "Product Not Found",
    description: product?.description || "Product details not found",
  };
}

const ProductDetailsPage = async ({ params }: Props) => {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);
  const cart = await getMyCart();

  if (!rawProduct) {
    notFound();
  }

  // Cast το rawProduct σε Product για να έχουμε σωστά types παντού
  const product = rawProduct as Product;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-4 mt-5 md:p-8 selection:bg-[#c5a059]/30">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <Link
          href="/"
          className="flex items-center text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Link>
        <h1 className="text-xl tracking-[0.4em] font-serif text-[#c5a059] uppercase">
          Opium
        </h1>
        <div className="w-10" />
      </header>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        {/* Left Side: Product Image */}
        <div className="relative aspect-4/5 bg-[#0f0f0f] border border-white/5 flex items-center justify-center p-12">
          <div className="absolute top-6 left-6 bg-[#c5a059] text-black text-[9px] font-bold px-2.5 py-1 tracking-tighter uppercase">
            {product.category}
          </div>
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={750}
              priority
              className="h-full object-contain drop-shadow-2xl"
            />
          ) : (
            <div className="text-gray-500">No image available</div>
          )}
        </div>

        {/* Right Side: Product Details & Configuration */}
        <ProductDetails product={product} cart={cart} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
