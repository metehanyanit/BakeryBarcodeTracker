
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Product } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BatchUpdateDialog({ products }: { products: Product[] }) {
  const [updates, setUpdates] = useState<Record<number, { quantity: string; reason: string }>>({});
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const batchUpdate = useMutation({
    mutationFn: async () => {
      const validUpdates = Object.entries(updates)
        .map(([id, data]) => ({
          id: parseInt(id),
          quantity: parseInt(data.quantity),
          reason: data.reason,
        }))
        .filter(update => !isNaN(update.quantity) && update.reason);

      if (validUpdates.length === 0) {
        throw new Error("No valid updates");
      }

      await apiRequest("POST", "/api/products/batch-update", validUpdates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Products updated successfully" });
      setOpen(false);
      setUpdates({});
    },
    onError: () => {
      toast({ 
        title: "Failed to update products", 
        variant: "destructive" 
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Batch Update</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Batch Update Products</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {products.map((product) => (
            <div key={product.id} className="flex gap-4 items-center">
              <span className="w-1/3 truncate">{product.name}</span>
              <Input
                type="number"
                placeholder="New quantity"
                className="w-24"
                value={updates[product.id]?.quantity ?? ""}
                onChange={(e) => 
                  setUpdates(prev => ({
                    ...prev,
                    [product.id]: { ...prev[product.id], quantity: e.target.value }
                  }))
                }
              />
              <Input
                placeholder="Reason for change"
                value={updates[product.id]?.reason ?? ""}
                onChange={(e) => 
                  setUpdates(prev => ({
                    ...prev,
                    [product.id]: { ...prev[product.id], reason: e.target.value }
                  }))
                }
              />
            </div>
          ))}
        </div>
        <Button 
          onClick={() => batchUpdate.mutate()}
          disabled={batchUpdate.isPending}
          className="w-full"
        >
          Update Products
        </Button>
      </DialogContent>
    </Dialog>
  );
}
