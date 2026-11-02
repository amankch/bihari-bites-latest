import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCached, setCached } from "@/lib/cache";

const CACHE_KEY = "admin:stats";

export async function GET() {
  try {
    // 1. Check in-memory fast cache (20s TTL)
    const cachedStats = getCached(CACHE_KEY);
    if (cachedStats) {
      return NextResponse.json(cachedStats, {
        headers: {
          "Cache-Control": "private, max-age=15",
          "X-Cache": "HIT",
        },
      });
    }

    // 2. Fetch lean queries from Neon PostgreSQL in parallel
    const [totalOrders, pendingUpiOrders, activeProducts, paidPayments, recentOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.payment.count({
          where: { status: "PENDING_VERIFICATION" },
        }),
        prisma.product.count({
          where: { isActive: true },
        }),
        prisma.payment.findMany({
          where: { status: "PAID" },
          select: { amount: true },
        }),
        // Avoid deep joins: admin overview only needs order + address + payment
        prisma.order.findMany({
          take: 6,
          orderBy: { createdAt: "desc" },
          include: {
            address: true,
            payment: true,
          },
        }),
      ]);

    const totalRevenue = paidPayments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );

    const payload = {
      totalRevenue,
      totalOrders,
      pendingUpiOrders,
      activeProducts,
      recentOrders,
    };

    // Cache for 20 seconds
    setCached(CACHE_KEY, payload, 20);

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "private, max-age=15",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Error computing admin stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
