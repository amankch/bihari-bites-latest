"use client";

import Link from "next/link";
import { Plus, Package, Edit3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useProducts } from "@/hooks/use-products";

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-bihari-terracotta">
            Catalogue Management
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-bihari-dark">
            Product Inventory
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your authentic Bihari delicacies: Thekua, Sattu, Aachar, and Ghee.
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button className="rounded-xl font-bold gap-1.5 shadow-md">
            <Plus className="h-4 w-4" /> Add New Delicacy
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            Loading products...
          </div>
        ) : products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/50 text-neutral-600 uppercase font-bold text-[10px] tracking-wider border-b border-amber-900/10">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Available Packs</th>
                  <th className="p-3">Starting Price</th>
                  <th className="p-3">Total Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10">
                {products.map((product) => {
                  const primaryImage =
                    product.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100&auto=format&fit=crop";
                  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                  const lowestPrice = Math.min(...product.variants.map((v) => Number(v.price)));

                  return (
                    <tr key={product.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={primaryImage}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover bg-amber-50"
                          />
                          <div>
                            <p className="font-serif font-bold text-sm text-bihari-dark">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-neutral-500">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-neutral-700">
                        {product.category?.name || "General"}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {product.variants.map((v) => (
                            <span
                              key={v.id}
                              className="rounded bg-amber-100/70 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-700"
                            >
                              {v.weight}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-bihari-dark">
                        {formatPrice(lowestPrice)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-bold ${
                            totalStock > 20 ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>
                      <td className="p-3">
                        {product.isFeatured ? (
                          <Badge variant="secondary" className="text-[10px] gap-1 font-bold">
                            <Sparkles className="h-3 w-3" /> Bestseller
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            Active
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs font-bold gap-1 border-amber-900/20 text-bihari-dark hover:bg-amber-100/50">
                              <Edit3 className="h-3 w-3" /> Edit
                            </Button>
                          </Link>
                          <Link href={`/products/${product.slug}`} target="_blank">
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-neutral-500 hover:text-neutral-800">
                              View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-neutral-500">
            No products found. Run seed script or click &quot;+ Add New Delicacy&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
