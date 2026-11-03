import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCached, setCached, invalidateCache } from "@/lib/cache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const featured = searchParams.get("featured") || "";

    const cacheKey = `products:${categorySlug}:${search}:${featured}`;
    const cachedProducts = getCached(cacheKey);

    if (cachedProducts) {
      return NextResponse.json(
        { products: cachedProducts },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            "X-Cache": "HIT",
          },
        }
      );
    }

    const where: any = {
      isActive: true,
    };

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: {
          orderBy: { price: "asc" },
        },
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Cache products for 5 minutes (300 seconds)
    setCached(cacheKey, products, 300);

    return NextResponse.json(
      { products },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Cache": "MISS",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
      categoryId,
      imageUrl,
      variants,
    } = body;

    if (!name || !slug || !description || !variants?.length) {
      return NextResponse.json(
        { message: "Please fill in all required product fields and at least one size pack." },
        { status: 400 }
      );
    }

    // Resolve Category ID from slug or ID safely
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

    // If still not resolved, assign first category in database
    if (!validCategoryId) {
      const firstCategory = await prisma.category.findFirst();
      validCategoryId = firstCategory?.id;
    }

    if (!validCategoryId) {
      return NextResponse.json(
        { message: "No category available. Please seed categories first." },
        { status: 400 }
      );
    }

    // Clean features array
    const cleanFeatures: string[] = Array.isArray(features)
      ? features.map((f: string) => f.trim()).filter(Boolean)
      : typeof features === "string"
      ? features.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    // Ensure clean unique slug
    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

    const product = await prisma.product.create({
      data: {
        name,
        slug: cleanSlug,
        tagline: tagline || null,
        description,
        ingredients: ingredients || null,
        features: cleanFeatures,
        shelfLife: shelfLife || "90 Days",
        isFeatured: Boolean(isFeatured),
        categoryId: validCategoryId,
        images: {
          create: [
            {
              url:
                imageUrl ||
                "/images/products/thekua.jpg",
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: variants.map((v: any, idx: number) => ({
            weight: v.weight || "Standard",
            price: Number(v.price),
            mrp: Number(v.mrp) || Number(v.price),
            stock: Number(v.stock) || 50,
            sku:
              v.sku ||
              `${cleanSlug}-${(v.weight || "std").toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now()}-${idx}`,
          })),
        },
      },
      include: {
        variants: true,
        images: true,
        category: true,
      },
    });

    // Invalidate product caches immediately
    invalidateCache("products");
    invalidateCache("product:slug");

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
