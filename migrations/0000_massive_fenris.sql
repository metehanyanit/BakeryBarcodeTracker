CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"barcode" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"min_quantity" integer DEFAULT 10 NOT NULL,
	"expiry_date" date NOT NULL,
	"image_url" text NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	CONSTRAINT "products_barcode_unique" UNIQUE("barcode")
);
--> statement-breakpoint
CREATE TABLE "quantity_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"change_amount" integer NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"reason" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"yield" text NOT NULL,
	"ingredients" text NOT NULL,
	"instructions" text NOT NULL
);
