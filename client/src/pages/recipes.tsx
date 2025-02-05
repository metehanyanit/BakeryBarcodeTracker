
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { type Recipe, type Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

export default function Recipes() {
  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#F9A825]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-josefin-sans font-bold text-[#3E2723]">
          Recipes
        </h1>
        <AddRecipeDialog products={products || []} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} products={products || []} />
        ))}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, products }: { recipe: Recipe; products: Product[] }) {
  const maxBatches = recipe.ingredients.reduce((min, ingredient) => {
    const product = products.find(p => p.id === ingredient.productId);
    if (!product) return 0;
    const possibleBatches = Math.floor(product.quantity / ingredient.quantity);
    return Math.min(min, possibleBatches);
  }, Infinity);

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold text-lg text-[#3E2723]">{recipe.name}</h3>
        <p className="text-sm text-[#795548] mt-1">{recipe.description}</p>
        <p className="text-sm mt-2">Yields: {recipe.yield}</p>
        <div className="mt-4">
          <h4 className="font-medium text-[#3E2723] mb-2">Ingredients:</h4>
          <ul className="space-y-1">
            {recipe.ingredients.map((ingredient) => {
              const product = products.find(p => p.id === ingredient.productId);
              return (
                <li key={ingredient.productId} className="text-sm">
                  {product?.name}: {ingredient.quantity} {ingredient.unit}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium">
            Can make {maxBatches} batch{maxBatches !== 1 ? 'es' : ''} with current stock
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
