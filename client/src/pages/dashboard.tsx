import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";
import ExpiryAlert from "@/components/expiry-alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import BatchUpdateDialog from "@/components/batch-update-dialog";

function ProductTable({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState("");

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(filter.toLowerCase()) ||
    product.category.toLowerCase().includes(filter.toLowerCase()) ||
    product.barcode.includes(filter)
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search products..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-sm"
      />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Min. Qty</TableHead>
              <TableHead>Expiry Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const isLowStock = product.quantity < product.minQuantity;
              const expiryDate = new Date(product.expiryDate);
              const isExpiringSoon = expiryDate.getTime() - new Date().getTime() < 86400000 * 2;

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-mono">{product.barcode}</TableCell>
                  <TableCell 
                    className={cn(
                      "text-right font-medium",
                      isLowStock ? "text-red-600" : "text-green-600"
                    )}
                  >
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-right">{product.minQuantity}</TableCell>
                  <TableCell
                    className={cn(
                      isExpiringSoon && "text-red-600"
                    )}
                  >
                    {format(expiryDate, "MMM dd, yyyy")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#F9A825]" />
      </div>
    );
  }
  if (!products) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-josefin-sans font-bold text-[#3E2723]">
            Inventory Dashboard
          </h1>
          <BatchUpdateDialog products={products} />
        </div>
      </div>
      <ExpiryAlert products={products} />
      <ProductTable products={products} />
    </div>
  );
}