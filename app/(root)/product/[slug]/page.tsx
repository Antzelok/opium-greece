import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import Image from "next/image";
import Link from "next/link";
import ProductDetails from "./product-details";


type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
  };
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);
  const cart = await getMyCart();

  if (!rawProduct) {
    notFound();
  }

  // Cast to Product type (category is validated in DB)
  const product = rawProduct as any;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-4 mt-5 md:p-8 selection:bg-[#c5a059]/30">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <Link
          href="/"
          className="flex items-center text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="text-sm mr-1" /> Back
        </Link>
        <h1 className="text-xl tracking-[0.4em] font-serif text-[#c5a059] uppercase">
          Opium
        </h1>
        <div className="w-10" />
      </header>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        {/* Left Side: Product Image */}
        <div className="relative aspect-[4/5] bg-[#0f0f0f] border border-white/5 flex items-center justify-center p-12">
          <div className="absolute top-6 left-6 bg-[#c5a059] text-black text-[9px] font-bold px-2.5 py-1 tracking-tighter">
            {product.category.toUpperCase()}
          </div>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={750}
            priority
            className="h-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Right Side: Configuration */}
        <ProductDetails product={product} cart={cart} />
      </div>
    </div>
  );
};

export default ProductPage;