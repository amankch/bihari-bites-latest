import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { buildUpiUri, generateUpiQrDataUrl, DEFAULT_UPI_VPA, MERCHANT_NAME } from "@/lib/upi";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
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
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    const upiUri = buildUpiUri({
      vpa: order.payment?.upiVpa || DEFAULT_UPI_VPA,
      payeeName: MERCHANT_NAME,
      amount: Number(order.finalAmount),
      transactionNote: `Order ${order.orderNumber}`,
      transactionRef: order.orderNumber,
    });

    const qrDataUrl = await generateUpiQrDataUrl(upiUri);

    return NextResponse.json({
      order,
      upiUri,
      qrDataUrl,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
