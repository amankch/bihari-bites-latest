import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invalidateCache } from "@/lib/cache";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body; // "APPROVE" | "REJECT"

    if (!["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid action. Must be APPROVE or REJECT." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    const isApprove = action === "APPROVE";

    // Update payment record
    const updatedPayment = await prisma.payment.update({
      where: { orderId: id },
      data: {
        status: isApprove ? "PAID" : "FAILED",
        verifiedAt: isApprove ? new Date() : null,
        verifiedBy: "ADMIN",
      },
    });

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: isApprove ? "CONFIRMED" : "PENDING_PAYMENT",
      },
    });

    // Invalidate stats cache so dashboard metrics update immediately
    invalidateCache("admin:stats");

    return NextResponse.json({
      message: isApprove
        ? "Payment verified successfully. Order confirmed!"
        : "Payment marked as rejected.",
      order: updatedOrder,
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error verifying UPI payment:", error);
    return NextResponse.json(
      { message: "Failed to verify UPI payment." },
      { status: 500 }
    );
  }
}
