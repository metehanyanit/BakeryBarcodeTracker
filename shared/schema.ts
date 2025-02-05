import { pgTable, text, serial, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type Recipe = {
  id: number;
  name: string;
  description: string;
  yield: string;
  ingredients: Array<{
    productId: number;
    quantity: number;
    unit: string;
  }>;
};

export type InsertRecipe = Omit<Recipe, "id">;

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  yield: text("yield").notNull(),
  ingredients: text("ingredients").notNull(), // Storing as JSONB would be better for complex data
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  barcode: text("barcode").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(0),
  minQuantity: integer("min_quantity").notNull().default(10),
  expiryDate: date("expiry_date").notNull(),
  imageUrl: text("image_url").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// New table for quantity history
export const quantityHistory = pgTable("quantity_history", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  changeAmount: integer("change_amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  reason: text("reason").notNull(),
});

export const insertProductSchema = createInsertSchema(products)
  .omit({ id: true, lastUpdated: true })
  .extend({
    quantity: z.number().min(0),
    minQuantity: z.number().min(1),
    expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  });

export const insertQuantityHistorySchema = createInsertSchema(quantityHistory)
  .omit({ id: true, timestamp: true });

export const insertRecipeSchema = createInsertSchema(recipes).omit({id: true});


export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type QuantityHistory = typeof quantityHistory.$inferSelect;
export type InsertQuantityHistory = z.infer<typeof insertQuantityHistorySchema>;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export const updateQuantitySchema = z.object({
  quantity: z.number().min(0),
  reason: z.string().min(1),
});

export type UpdateQuantity = z.infer<typeof updateQuantitySchema>;

export const batchUpdateSchema = z.array(z.object({
  id: z.number(),
  quantity: z.number().min(0),
  reason: z.string().min(1),
}));

export const recipeIngredientSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(0),
  unit: z.string(),
});

export const recipeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  description: z.string(),
  yield: z.number().min(1),
  ingredients: z.array(recipeIngredientSchema),
  instructions: z.string(),
});

export type BatchUpdate = z.infer<typeof batchUpdateSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;