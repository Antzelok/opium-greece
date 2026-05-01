import { Metadata } from "next";
import { getProductsByCategory } from "@/lib/actions/product.actions";
import { Product } from "@/types";
import ProductCard from "@/components/shared/product/product-card";

export const metadata: Metadata = {
  title: "For Him",
};

const ForHimPage = async () => {
  const menProducts: Product[] = await getProductsByCategory("Men");

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter uppercase italic">
          For Him
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Ανακαλύψτε αρώματα που εκπέμπουν δυναμισμό και κομψότητα.
        </p>
      </header>

      {menProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {menProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border rounded-lg bg-gray-50/50">
          <p className="text-xl font-medium text-muted-foreground">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ForHimPage;
