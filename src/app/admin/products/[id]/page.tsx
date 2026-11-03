"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Check, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/admin/image-uploader";

const CATEGORIES = [
  { name: "Sweets & Traditional Snacks (Khasta Thekua)", slug: "sweets-snacks" },
  { name: "Sattu & Superfoods (Roasted Chana Sattu)", slug: "staples-superfoods" },
  { name: "Bihari Aachar & Chutney (Lal Mirch Bharua, Aam)", slug: "pickles-aachar" },
  { name: "Pure Bilona Desi Ghee (Danedar Cow Ghee)", slug: "pure-desi-ghee" },
];

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    ingredients: "",
    features: [] as string[],
    featureInput: "",
    shelfLife: "",
    categorySlug: "sweets-snacks",
    imageUrl: "",
    isFeatured: false,
    isActive: true,
  });

  const [variants, setVariants] = useState<
    Array<{ id?: string; weight: string; price: number; mrp: number; stock: number; sku: string }>
  >([]);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        const p = data.product;

        setFormData({
          name: p.name || "",
          slug: p.slug || "",
          tagline: p.tagline || "",
          description: p.description || "",
          ingredients: p.ingredients || "",
          features: Array.isArray(p.features) ? p.features : [],
          featureInput: "",
          shelfLife: p.shelfLife || "",
          categorySlug: p.category?.slug || "sweets-snacks",
          imageUrl: p.images?.[0]?.url || "",
          isFeatured: Boolean(p.isFeatured),
          isActive: Boolean(p.isActive),
        });

        if (p.variants && p.variants.length > 0) {
          setVariants(
            p.variants.map((v: any) => ({
              id: v.id, // Preserved so existing variants update in place without foreign key errors
              weight: v.weight,
              price: Number(v.price),
              mrp: Number(v.mrp),
              stock: Number(v.stock),
              sku: v.sku,
            }))
          );
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const addFeature = () => {
    const text = formData.featureInput.trim();
    if (!text) return;
    if (formData.features.includes(text)) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, text],
      featureInput: "",
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { weight: "1kg", price: 549, mrp: 650, stock: 50, sku: `${formData.slug || "item"}-${Date.now()}` },
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
      setErrorMsg("Please fill in delicacy name, slug and description.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          tagline: formData.tagline,
          description: formData.description,
          ingredients: formData.ingredients,
          features: formData.features,
          shelfLife: formData.shelfLife,
          categoryId: formData.categorySlug,
          imageUrl: formData.imageUrl,
          isFeatured: formData.isFeatured,
          isActive: formData.isActive,
          variants,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      setSuccessMsg("Delicacy details and features updated successfully!");
      setTimeout(() => {
        window.location.href = "/admin/products";
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update product.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${formData.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      window.location.href = "/admin/products";
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="h-10 w-10 animate-spin border-4 border-bihari-terracotta border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm font-semibold text-neutral-600">Loading delicacy details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-bihari-terracotta mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Delicacies
          </Link>
          <h1 className="font-serif text-3xl font-extrabold text-bihari-dark">
            Edit Delicacy: {formData.name}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Modify product description, features, pricing, and pack sizes.
          </p>
        </div>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="rounded-xl font-bold self-start sm:self-auto gap-1"
        >
          <Trash2 className="h-4 w-4" /> Delete Delicacy
        </Button>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200/60 p-4 text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200/60 p-4 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0 text-emerald-600" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-bihari-dark border-b border-amber-900/10 pb-3">
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Delicacy Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="category">Delicacy Category *</Label>
              <select
                id="category"
                value={formData.categorySlug}
                onChange={(e) => setFormData((p) => ({ ...p, categorySlug: e.target.value }))}
                className="w-full text-xs font-semibold rounded-xl border border-amber-900/20 bg-white p-2.5 text-bihari-dark focus:outline-none focus:ring-2 focus:ring-bihari-terracotta"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="shelfLife">Shelf Life</Label>
              <Input
                id="shelfLife"
                value={formData.shelfLife}
                onChange={(e) => setFormData((p) => ({ ...p, shelfLife: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="tagline">Tagline / Cultural Hook</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData((p) => ({ ...p, tagline: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="description">Traditional Description & Heritage *</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                required
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="ingredients">Pure Ingredients</Label>
              <Input
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => setFormData((p) => ({ ...p, ingredients: e.target.value }))}
              />
            </div>

            {/* Product Creative with Auto-Compression */}
            <div className="sm:col-span-2 pt-2">
              <ImageUploader
                value={formData.imageUrl}
                onChange={(url) => setFormData((p) => ({ ...p, imageUrl: url }))}
                label="Product Creative / Photograph (Auto-Compressed)"
              />
            </div>

            {/* Badges and Flags */}
            <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2 border-t border-amber-900/10">
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
                  className="h-4 w-4 rounded text-bihari-terracotta focus:ring-bihari-terracotta"
                />
                Mark as Bestseller (Hero / Featured Showcase)
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-600"
                />
                Product Active for Customers
              </label>
            </div>
          </div>
        </div>

        {/* Product Features & Guarantees Section */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-amber-900/10 pb-3">
            <h3 className="font-serif font-bold text-lg text-bihari-dark">
              Product Features & Authenticity Badges
            </h3>
            <p className="text-xs text-neutral-500">
              Displayed as bullet points on the product page (e.g. &quot;100% Pure Desi Ghee&quot;, &quot;Stone Ground&quot;, &quot;Zero Preservatives&quot;).
            </p>
          </div>

          {/* Add New Feature Input */}
          <div className="flex gap-2">
            <Input
              value={formData.featureInput}
              onChange={(e) => setFormData((p) => ({ ...p, featureInput: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder="e.g. 100% Pure Desi Cow Ghee"
              className="text-xs"
            />
            <Button
              type="button"
              onClick={addFeature}
              className="rounded-xl text-xs font-bold shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Feature
            </Button>
          </div>

          {/* Features Pills List */}
          <div className="flex flex-wrap gap-2 pt-2">
            {formData.features.map((feat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100/70 border border-amber-900/10 px-3 py-1.5 text-xs font-semibold text-neutral-800"
              >
                <span>✓ {feat}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="text-neutral-400 hover:text-red-600 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
            {formData.features.length === 0 && (
              <p className="text-xs text-neutral-400 italic">No features added yet. Type above and click &quot;Add Feature&quot;.</p>
            )}
          </div>
        </div>

        {/* Variants & Pricing */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-bihari-dark">
                Packs, Sizes & Pricing
              </h3>
              <p className="text-xs text-neutral-500">Edit weights, selling price, MRP, and stock.</p>
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
                  <Label className="text-[11px]">Pack Weight</Label>
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
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <Label className="text-[11px]">MRP (₹)</Label>
                  <Input
                    type="number"
                    value={v.mrp}
                    onChange={(e) => updateVariant(idx, "mrp", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <Label className="text-[11px]">Stock Qty</Label>
                  <Input
                    type="number"
                    value={v.stock}
                    onChange={(e) => updateVariant(idx, "stock", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <Label className="text-[11px]">SKU Code</Label>
                  <Input
                    value={v.sku}
                    onChange={(e) => updateVariant(idx, "sku", e.target.value)}
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
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
