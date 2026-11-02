"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    ingredients: "",
    shelfLife: "90 Days",
    categorySlug: "sweets-snacks",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop",
    isFeatured: false,
  });

  const [variants, setVariants] = useState([
    { weight: "500g", price: 299, mrp: 350, stock: 100, sku: "DEL-500G" },
  ]);

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { weight: "1kg", price: 549, mrp: 650, stock: 50, sku: `DEL-1000G-${Date.now()}` },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.description) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // First get or assume category ID or map to default
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoryId: "sweets-snacks", // Will link to category
          variants,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create product.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-bihari-terracotta mb-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <h1 className="font-serif text-3xl font-extrabold text-bihari-dark">
          Add New Bihari Delicacy
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Publish a new traditional product with weight-based pricing.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-red-50 p-4 text-xs text-red-600 font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-bihari-dark border-b border-amber-900/10 pb-3">
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Delicacy Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Shuddh Ghee Khasta Thekua"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name: val,
                    slug: val.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  }));
                }}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                placeholder="shuddh-ghee-khasta-thekua"
                value={formData.slug}
                onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                required
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="tagline">Tagline / Cultural Hook</Label>
              <Input
                id="tagline"
                placeholder="e.g. Authentic Chhath Puja Style Pure Desi Ghee Thekua"
                value={formData.tagline}
                onChange={(e) => setFormData((p) => ({ ...p, tagline: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="description">Traditional Description & Heritage *</Label>
              <Textarea
                id="description"
                placeholder="Describe how it is handcrafted, wooden die patterns, ingredients..."
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ingredients">Pure Ingredients</Label>
              <Input
                id="ingredients"
                placeholder="Whole wheat atta, Desi cow ghee, Organic gur, Saunf"
                value={formData.ingredients}
                onChange={(e) => setFormData((p) => ({ ...p, ingredients: e.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="shelfLife">Shelf Life</Label>
              <Input
                id="shelfLife"
                placeholder="45 Days"
                value={formData.shelfLife}
                onChange={(e) => setFormData((p) => ({ ...p, shelfLife: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploader
                value={formData.imageUrl}
                onChange={(url) => setFormData((p) => ({ ...p, imageUrl: url }))}
                label="Product Creative / Photograph (Auto-Compressed)"
              />
            </div>
          </div>
        </div>

        {/* Variants & Pricing */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-bihari-dark">
                Packs, Sizes & Pricing
              </h3>
              <p className="text-xs text-neutral-500">Add multiple weights (e.g. 250g, 500g, 1kg)</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariant}
              className="text-xs font-bold gap-1 border-amber-900/20"
            >
              <Plus className="h-3.5 w-3.5" /> Add Size Pack
            </Button>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-end p-3 rounded-xl bg-amber-50/50 border border-amber-900/10"
              >
                <div className="space-y-1 sm:col-span-1">
                  <Label className="text-[11px]">Weight / Size</Label>
                  <Input
                    value={v.weight}
                    onChange={(e) => updateVariant(idx, "weight", e.target.value)}
                    placeholder="500g"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <Label className="text-[11px]">Selling Price (₹)</Label>
                  <Input
                    type="number"
                    value={v.price}
                    onChange={(e) => updateVariant(idx, "price", Number(e.target.value))}
                    placeholder="299"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <Label className="text-[11px]">MRP (₹)</Label>
                  <Input
                    type="number"
                    value={v.mrp}
                    onChange={(e) => updateVariant(idx, "mrp", Number(e.target.value))}
                    placeholder="350"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <Label className="text-[11px]">Stock Qty</Label>
                  <Input
                    type="number"
                    value={v.stock}
                    onChange={(e) => updateVariant(idx, "stock", Number(e.target.value))}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <Label className="text-[11px]">SKU Code</Label>
                  <Input
                    value={v.sku}
                    onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                    placeholder="THK-500G"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(idx)}
                    disabled={variants.length <= 1}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline" className="border-amber-900/20">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="font-bold px-8 shadow-md">
            {isSubmitting ? "Publishing..." : "Publish Delicacy"}
          </Button>
        </div>
      </form>
    </div>
  );
}
