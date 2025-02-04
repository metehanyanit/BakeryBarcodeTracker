import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { type Product } from "@shared/schema";
import { format } from "date-fns";

export default function ExpiryAlert({ products }: { products: Product[] }) {
  const expiringSoon = products.filter(
    (p) => new Date(p.expiryDate).getTime() - new Date().getTime() < 86400000 * 2
  );

  if (expiringSoon.length === 0) return null;

  return (
    <Alert className="bg-red-50 border-red-200 mb-4">
      <AlertTitle className="text-red-800">
        Products Expiring Soon
      </AlertTitle>
      <AlertDescription className="text-red-600">
        <ul className="list-disc list-inside">
          {expiringSoon.map((product) => (
            <li key={product.id}>
              {product.name} - Expires {format(new Date(product.expiryDate), "MMM dd, yyyy")}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
