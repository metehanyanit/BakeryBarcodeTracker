import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import ExpiryAlert from "@/components/expiry-alert";
import { type Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!products) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-josefin-sans font-bold text-[#3E2723]">
        Inventory Dashboard
      </h1>
      <ExpiryAlert products={products} />
      <ProductGrid products={products} />
    </div>
  );
}
