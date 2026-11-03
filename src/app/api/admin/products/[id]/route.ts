import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invalidateCache } from "@/lib/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          orderBy: { price: "asc" },
        },
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Delicacy not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      name,
      slug,
      tagline,
      description,
      ingredients,
      features,
      shelfLife,
      isFeatured,
      isActive,
      categoryId,
      imageUrl,
      variants,
    } = body;

    if (!name || !slug || !description) {
      return NextResponse.json(
        { message: "Product name, slug and description are required." },
        { status: 400 }
      );
    }

    // Process features into a clean string array
    const cleanFeatures: string[] = Array.isArray(features)
      ? features.map((f: string) => f.trim()).filter(Boolean)
      : typeof features === "string"
      ? features
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    // Resolve Category ID from slug or ID safely if provided
    let validCategoryId: string | undefined = undefined;
    if (categoryId) {
      const foundCategory = await prisma.category.findFirst({
        where: {
          OR: [{ id: categoryId }, { slug: categoryId }],
        },
      });
      if (foundCategory) {
        validCategoryId = foundCategory.id;
      }
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

    // Update Product Details
    const updateData: any = {
      name,
      slug: cleanSlug,
      tagline: tagline || null,
      description,
      ingredients: ingredients || null,
      features: cleanFeatures,
      shelfLife: shelfLife || null,
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    };

    if (validCategoryId) {
      updateData.categoryId = validCategoryId;
    }

    // Update primary image if provided
    if (imageUrl) {
      const existingImage = await prisma.productImage.findFirst({
        where: { productId: id, isPrimary: true },
      });

      if (existingImage) {
        await prisma.productImage.update({
          where: { id: existingImage.id },
          data: { url: imageUrl, alt: name },
        });
      } else {
        await prisma.productImage.create({
          data: {
            productId: id,
            url: imageUrl,
            alt: name,
            isPrimary: true,
          },
        });
      }
    }

    // Update or upsert variants safely WITHOUT deleteMany (preserves order_item foreign keys!)
    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (const [idx, v] of variants.entries()) {
        const vWeight = v.weight || "Standard";
        const vPrice = Number(v.price);
        const vMrp = Number(v.mrp) || vPrice;
        const vStock = Number(v.stock) || 50;
        const vSku = v.sku || `${cleanSlug}-${vWeight.toLowerCase().replace(/[^a-z0-9]/g, "")}-${idx}`;

        if (v.id) {
          // Update existing variant in place
          await prisma.productVariant
            .update({
              where: { id: v.id },
              data: {
                weight: vWeight,
                price: vPrice,
                mrp: vMrp,
                stock: vStock,
                sku: vSku,
              },
            })
            .catch((err) => console.warn("Variant update warning:", err?.message || err));
        } else {
          // Brand new variant added in editor
          await prisma.productVariant
            .create({
              data: {
                productId: id,
                weight: vWeight,
                price: vPrice,
                mrp: vMrp,
                stock: vStock,
                sku: `${vSku}-${Date.now()}`,
              },
            })
            .catch((err) => console.warn("Variant create warning:", err?.message || err));
        }
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    // Purge cached products so changes are immediately visible
    invalidateCache("products");
    invalidateCache("product:slug");

    return NextResponse.json({
      message: "Delicacy details and features updated successfully!",
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });
    invalidateCache("products");
    invalidateCache("product:slug");
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
