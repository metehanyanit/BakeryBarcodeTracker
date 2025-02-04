import { type Product, type InsertProduct } from "@shared/schema";
import { addDays } from "date-fns";

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    barcode: "123456789",
    name: "Sourdough Bread",
    description: "Artisanal sourdough bread made fresh daily",
    category: "Bread",
    quantity: 15,
    minQuantity: 10,
    expiryDate: addDays(new Date(), 2),
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
    lastUpdated: new Date(),
  },
  {
    id: 2,
    barcode: "987654321",
    name: "Chocolate Croissant",
    description: "Buttery croissant filled with dark chocolate",
    category: "Pastries",
    quantity: 8,
    minQuantity: 15,
    expiryDate: addDays(new Date(), 1),
    imageUrl: "https://images.unsplash.com/photo-1523294587484-bae6cc870010",
    lastUpdated: new Date(),
  },
];

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductByBarcode(barcode: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateQuantity(id: number, quantity: number): Promise<Product>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private currentId: number;

  constructor() {
    this.products = new Map(SAMPLE_PRODUCTS.map(p => [p.id, p]));
    this.currentId = SAMPLE_PRODUCTS.length + 1;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.barcode === barcode);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const product: Product = {
      ...insertProduct,
      id,
      lastUpdated: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateQuantity(id: number, quantity: number): Promise<Product> {
    const product = await this.getProduct(id);
    if (!product) throw new Error("Product not found");
    
    const updated: Product = {
      ...product,
      quantity,
      lastUpdated: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
