import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Product } from "@shared/schema";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import StockForecast from "./stock-forecast";

export default function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateQuantity = useMutation({
    mutationFn: async (newQuantity: number) => {
      await apiRequest("PATCH", `/api/products/${product.id}/quantity`, {
        quantity: newQuantity,
        reason: reason || `Updated quantity to ${newQuantity}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${product.id}/history`] });
      toast({ title: "Quantity updated successfully" });
      setReason("");
    },
    onError: () => {
      toast({ 
        title: "Failed to update quantity", 
        variant: "destructive" 
      });
    },
  });

  const handleUpdate = () => {
    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast({ 
        title: "Invalid quantity", 
        description: "Please enter a valid number",
        variant: "destructive" 
      });
      return;
    }
    if (!reason && newQuantity !== product.quantity) {
      toast({ 
        title: "Reason required", 
        description: "Please provide a reason for the quantity change",
        variant: "destructive" 
      });
      return;
    }
    updateQuantity.mutate(newQuantity);
  };

  const isLowStock = product.quantity < product.minQuantity;
  const expiryDate = new Date(product.expiryDate);
  const isExpiringSoon = expiryDate.getTime() - new Date().getTime() < 86400000 * 2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-[#3E2723] truncate">{product.name}</h3>
              <p className="text-sm text-[#795548] line-clamp-2">{product.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm">Category: {product.category}</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-sm",
                    isLowStock 
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  )}
                >
                  Stock: {product.quantity}
                </span>
              </div>
              <p
                className={cn(
                  "text-sm mt-1",
                  isExpiringSoon ? "text-red-600" : "text-[#795548]"
                )}
              >
                Expires: {format(expiryDate, "MMM dd, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-24"
              min="0"
            />
            <Input
              placeholder="Reason for change..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleUpdate}
              disabled={updateQuantity.isPending}
              className="bg-[#F9A825] hover:bg-[#F57F17] text-white whitespace-nowrap"
            >
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      <StockForecast product={product} />
    </div>
  );
}