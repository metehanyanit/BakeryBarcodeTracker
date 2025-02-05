import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertProductSchema, updateQuantitySchema, batchUpdateSchema, recipeSchema } from "@shared/schema";

export function registerRoutes(app: Express) {
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.get("/api/products/barcode/:barcode", async (req, res) => {
    const product = await storage.getProductByBarcode(req.params.barcode);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.get("/api/products/:id/history", async (req, res) => {
    const history = await storage.getQuantityHistory(Number(req.params.id));
    res.json(history);
  });

  app.post("/api/products", async (req, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid product data", errors: result.error });
    }
    const product = await storage.createProduct(result.data);
    res.status(201).json(product);
  });

  app.patch("/api/products/:id/quantity", async (req, res) => {
    const result = updateQuantitySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid quantity update", errors: result.error });
    }

    try {
      const product = await storage.updateQuantity(
        Number(req.params.id),
        result.data.quantity,
        result.data.reason
      );
      res.json(product);
    } catch (error) {
      res.status(404).json({ message: "Product not found" });
    }
  });

  app.post("/api/products/batch-update", async (req, res) => {
    const result = batchUpdateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid batch update data", errors: result.error });
    }

    try {
      const products = await storage.batchUpdateQuantity(result.data);
      res.json(products);
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  });

  app.get("/api/recipes", async (_req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  app.post("/api/recipes", async (req, res) => {
    const result = recipeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid recipe data", errors: result.error });
    }
    const recipe = await storage.createRecipe(result.data);
    res.status(201).json(recipe);
  });

  return createServer(app);
}