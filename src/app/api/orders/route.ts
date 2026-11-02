import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { buildUpiUri, generateUpiQrDataUrl, DEFAULT_UPI_VPA, MERCHANT_NAME } from "@/lib/upi";
import { checkoutFormSchema } from "@/lib/validations/checkout";
import { invalidateCache } from "@/lib/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, address: addressInput, customerNotes, guestEmail } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Your cart is empty" },
        { status: 400 }
      );
    }

    const validatedAddress = checkoutFormSchema.safeParse(addressInput);
    if (!validatedAddress.success) {
      return NextResponse.json(
        { message: "Invalid delivery address", errors: validatedAddress.error.format() },
        { status: 400 }
      );
    }

    const addr = validatedAddress.data;

    // Fetch variant prices from DB to ensure integrity against tampering
    const variantIds = items.map((i: any) => i.variantId);
    const dbVariants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    if (dbVariants.length !== items.length) {
      return NextResponse.json(
        { message: "Some items in your cart are no longer available" },
        { status: 400 }
      );
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItemsData = items.map((item: any) => {
      const dbVar = dbVariants.find((v) => v.id === item.variantId)!;
      const itemPrice = Number(dbVar.price);
      subtotal += itemPrice * item.quantity;
      return {
        productVariantId: item.variantId,
        quantity: item.quantity,
        price: itemPrice,
      };
    });

    const shippingFee = subtotal >= 500 ? 0 : 49;
    const finalAmount = subtotal + shippingFee;
    const orderNumber = generateOrderNumber();

    // Create Address record
    const addressRecord = await prisma.address.create({
      data: {
        fullName: addr.fullName,
        phone: addr.phone,
        alternatePhone: addr.alternatePhone || null,
        streetAddress: addr.streetAddress,
        landmark: addr.landmark || null,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
      },
    });

    // Create Order with Items and Payment
    const order = await prisma.order.create({
      data: {
        orderNumber,
        addressId: addressRecord.id,
        guestEmail: guestEmail || null,
        guestPhone: addr.phone,
        totalAmount: subtotal,
        shippingFee: shippingFee,
        finalAmount: finalAmount,
        status: "CONFIRMED",
        customerNotes: customerNotes || null,
        items: {
          create: orderItemsData,
        },
        payment: {
          create: {
            method: addr.paymentMethod || "UPI",
            amount: finalAmount,
            upiVpa: DEFAULT_UPI_VPA,
            status: "PENDING_VERIFICATION",
          },
        },
      },
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

    // Build dynamic UPI URI & QR Code
    const upiUri = buildUpiUri({
      vpa: DEFAULT_UPI_VPA,
      payeeName: MERCHANT_NAME,
      amount: finalAmount,
      transactionNote: `Order ${orderNumber}`,
      transactionRef: orderNumber,
    });

    const qrDataUrl = await generateUpiQrDataUrl(upiUri);

    // Invalidate admin stats cache so pending UPI count increments immediately
    invalidateCache("admin:stats");

    return NextResponse.json(
      {
        order,
        upiUri,
        qrDataUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Failed to place order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    const where: any = {};
    if (phone) {
      where.guestPhone = phone;
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

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to retrieve orders" },
      { status: 500 }
    );
  }
}
