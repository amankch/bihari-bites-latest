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

    if (!name || !slug || !description || !categoryId || !variants?.length) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        tagline,
        description,
        ingredients,
        features: Array.isArray(features) ? features : [],
        shelfLife,
        isFeatured: Boolean(isFeatured),
        categoryId,
        images: {
          create: [
            {
              url:
                imageUrl ||
                "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop",
              isPrimary: true,
            },
          ],
        },
        variants: {
          create: variants.map((v: any) => ({
            weight: v.weight,
            price: v.price,
            mrp: v.mrp,
            stock: v.stock || 50,
            sku: v.sku || `${slug}-${v.weight.toLowerCase()}`,
          })),
        },
      },
      include: {
        variants: true,
        images: true,
      },
    });

    // Invalidate product caches immediately
    invalidateCache("products");

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
