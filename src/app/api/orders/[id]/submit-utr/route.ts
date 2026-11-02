import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidUtr } from "@/lib/upi";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { utr } = body;

    if (!utr || typeof utr !== "string" || !isValidUtr(utr)) {
      return NextResponse.json(
        { message: "Please provide a valid 12-digit UPI UTR reference number." },
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

    const updatedPayment = await prisma.payment.upsert({
      where: { orderId: id },
      update: {
        upiTxnRef: utr.trim().toUpperCase(),
        status: "PENDING_VERIFICATION",
      },
      create: {
        orderId: id,
        amount: order.finalAmount,
        upiTxnRef: utr.trim().toUpperCase(),
        status: "PENDING_VERIFICATION",
      },
    });

    return NextResponse.json({
      message: "UTR submitted successfully. Admin will verify and dispatch.",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error submitting UTR:", error);
    return NextResponse.json(
      { message: "Failed to submit UTR." },
      { status: 500 }
    );
  }
}
