import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { type Product } from "@shared/schema";
import { format } from "date-fns";

export default function ExpiryAlert({ products }: { products: Product[] }) {
  const expiringSoon = products.filter(
    (p) => new Date(p.expiryDate).getTime() - new Date().getTime() < 86400000 * 2
  );

  if (expiringSoon.length === 0) return null;

  return (
    <Alert className="bg-red-50 border-red-200">
      <AlertTitle className="text-red-800 flex items-center gap-2">
        Products Expiring Soon ({expiringSoon.length})
      </AlertTitle>
      <AlertDescription className="text-red-600">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
          {expiringSoon.map((product) => (
            <div key={product.id} className="text-sm">
              <span className="font-medium">{product.name}</span>
              <span className="block text-xs">
                Expires {format(new Date(product.expiryDate), "MMM dd, yyyy")}
              </span>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}