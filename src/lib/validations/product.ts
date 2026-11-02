import { z } from "zod";

export const variantSchema = z.object({
  weight: z.string().min(1, "Weight label is required (e.g., 500g, 1kg)"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  mrp: z.coerce.number().positive("MRP must be greater than zero"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  sku: z.string().min(3, "SKU is required"),
});

export const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  slug: z.string().min(3, "Product slug must be at least 3 characters"),
  tagline: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  ingredients: z.string().optional(),
  features: z.string().transform((val) =>
    val
      ? val
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  ),
  shelfLife: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Valid image URL required"),
  variants: z.array(variantSchema).min(1, "At least one product variant is required"),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
