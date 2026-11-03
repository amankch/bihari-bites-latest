import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCached, setCached } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";

    const cacheKey = `admin:orders:${status}`;
    const cachedOrders = getCached(cacheKey);

    if (cachedOrders) {
      return NextResponse.json(
        { orders: cachedOrders },
        {
          headers: {
            "Cache-Control": "private, max-age=15",
            "X-Cache": "HIT",
          },
        }
      );
    }

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        address: true,
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Cache orders for 30 seconds
    setCached(cacheKey, orders, 30);

    return NextResponse.json(
      { orders },
      {
        headers: {
          "Cache-Control": "private, max-age=15",
          "X-Cache": "MISS",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
