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
        { message: "Product not found" },
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
        { message: "Product name, slug and description are required" },
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

    // Update Product Details
    const updateData: any = {
      name,
      slug,
      tagline: tagline || null,
      description,
      ingredients: ingredients || null,
      features: cleanFeatures,
      shelfLife: shelfLife || null,
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    };

    if (categoryId) {
      updateData.categoryId = categoryId;
    }

    // Update primary image if provided
    if (imageUrl) {
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });
      await prisma.productImage.create({
        data: {
          productId: id,
          url: imageUrl,
          alt: name,
          isPrimary: true,
        },
      });
    }

    // Update or recreate variants if provided
    if (variants && Array.isArray(variants) && variants.length > 0) {
      // Delete existing variants and re-create to keep sync clean
      await prisma.productVariant.deleteMany({
        where: { productId: id },
      });

      await prisma.productVariant.createMany({
        data: variants.map((v: any) => ({
          productId: id,
          weight: v.weight,
          price: v.price,
          mrp: v.mrp || v.price,
          stock: v.stock || 50,
          sku: v.sku || `${slug}-${v.weight.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        })),
      });
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
      message: "Product and features updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
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
