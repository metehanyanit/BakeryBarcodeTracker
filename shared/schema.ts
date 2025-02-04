import { pgTable, text, serial, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type QuantityHistory = typeof quantityHistory.$inferSelect;
export type InsertQuantityHistory = z.infer<typeof insertQuantityHistorySchema>;

export const updateQuantitySchema = z.object({
  quantity: z.number().min(0),
  reason: z.string().min(1),
});

export type UpdateQuantity = z.infer<typeof updateQuantitySchema>;