import { type Product, type InsertProduct, type QuantityHistory, type Recipe, type InsertRecipe, products, quantityHistory, recipes } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductByBarcode(barcode: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateQuantity(id: number, quantity: number, reason: string): Promise<Product>;
  getQuantityHistory(productId: number): Promise<QuantityHistory[]>;
  batchUpdateQuantity(updates: { id: number; quantity: number; reason: string }[]): Promise<Product[]>;
  getRecipes(): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
}

export class DatabaseStorage implements IStorage {
  async getRecipes(): Promise<Recipe[]> {
    const dbRecipes = await db.select().from(recipes);
    return dbRecipes.map(recipe => ({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients)
    }));
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const dbRecipe = {
      ...recipe,
      ingredients: JSON.stringify(recipe.ingredients)
    };
    const [newRecipe] = await db.insert(recipes).values(dbRecipe).returning();
    return {
      ...newRecipe,
      ingredients: JSON.parse(newRecipe.ingredients)
    };
  }
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.barcode, barcode));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateQuantity(id: number, newQuantity: number, reason: string): Promise<Product> {
    const oldProduct = await this.getProduct(id);
    if (!oldProduct) throw new Error("Product not found");

    const changeAmount = newQuantity - oldProduct.quantity;

    // Start a transaction to update both tables
    return await db.transaction(async (tx) => {
      // Update product quantity
      const [product] = await tx
        .update(products)
        .set({ quantity: newQuantity, lastUpdated: new Date() })
        .where(eq(products.id, id))
        .returning();

      // Record the change in history
      await tx.insert(quantityHistory).values({
        productId: id,
        quantity: newQuantity,
        changeAmount,
        reason,
      });

      return product;
    });
  }

  async getQuantityHistory(productId: number): Promise<QuantityHistory[]> {
    return await db
      .select()
      .from(quantityHistory)
      .where(eq(quantityHistory.productId, productId))
      .orderBy(desc(quantityHistory.timestamp));
  }

  async batchUpdateQuantity(updates: { id: number; quantity: number; reason: string }[]) {
    return await db.transaction(async (tx) => {
      const results = [];
      for (const update of updates) {
        const [product] = await tx
          .select()
          .from(products)
          .where(eq(products.id, update.id));

        if (!product) {
          throw new Error(`Product ${update.id} not found`);
        }

        await tx
          .insert(quantityHistory)
          .values({
            productId: update.id,
            quantity: update.quantity,
            changeAmount: update.quantity - product.quantity,
            reason: update.reason,
          });

        const [updatedProduct] = await tx
          .update(products)
          .set({ quantity: update.quantity, lastUpdated: new Date() })
          .where(eq(products.id, update.id))
          .returning();

        results.push(updatedProduct);
      }
      return results;
    });
  }
}

export const storage = new DatabaseStorage();