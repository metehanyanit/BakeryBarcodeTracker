import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Product } from "@shared/schema";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateQuantity = useMutation({
    mutationFn: async (newQuantity: number) => {
      await apiRequest("PATCH", `/api/products/${product.id}/quantity`, {
        quantity: newQuantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Quantity updated successfully" });
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
    updateQuantity.mutate(newQuantity);
  };

  const isLowStock = product.quantity < product.minQuantity;
  const expiryDate = new Date(product.expiryDate);
  const isExpiringSoon = expiryDate.getTime() - new Date().getTime() < 86400000 * 2;

  return (
    <Card className="w-full">
      <CardContent className="pt-4">
        <div className="aspect-square rounded-md overflow-hidden mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-[#3E2723]">{product.name}</h3>
          <p className="text-sm text-[#795548]">{product.description}</p>
          <div className="flex justify-between items-center text-sm">
            <span>Category: {product.category}</span>
            <span
              className={cn(
                "px-2 py-1 rounded",
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
              "text-sm",
              isExpiringSoon ? "text-red-600" : "text-[#795548]"
            )}
          >
            Expires: {format(expiryDate, "MMM dd, yyyy")}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-24"
          min="0"
        />
        <Button 
          onClick={handleUpdate}
          disabled={updateQuantity.isPending}
          className="bg-[#F9A825] hover:bg-[#F57F17] text-white"
        >
          Update
        </Button>
      </CardFooter>
    </Card>
  );
}
