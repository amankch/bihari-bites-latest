import QRCode from "qrcode";

export const BRAND_HOTLINE = "+917281991952";
export const BRAND_WHATSAPP = "917281991952";
export const BRAND_ADDRESS =
  process.env.NEXT_PUBLIC_STORE_ADDRESS ||
  "IMS Patna, Jay Prakash Nagar, Near Sipara Overbridge, Patna-01";
export const DEFAULT_UPI_VPA =
  process.env.NEXT_PUBLIC_UPI_VPA || "7281991952@upi";
export const MERCHANT_NAME =
  process.env.NEXT_PUBLIC_MERCHANT_NAME || "BIHARI BITES";

export interface UpiUriParams {
  vpa?: string;
  payeeName?: string;
  amount: number | string;
  transactionNote: string;
  transactionRef: string;
}

/**
 * Builds standard NPCI UPI payment deep link intent
 * Compatible with Google Pay, PhonePe, Paytm, BHIM, Cred, and bank UPI apps.
 */
export function buildUpiUri({
  vpa = DEFAULT_UPI_VPA,
  payeeName = MERCHANT_NAME,
  amount,
  transactionNote,
  transactionRef,
}: UpiUriParams): string {
  const numericAmount =
    typeof amount === "number" ? amount.toFixed(2) : parseFloat(amount).toFixed(2);
  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(transactionNote.slice(0, 30));

  return `upi://pay?pa=${vpa}&pn=${encodedName}&am=${numericAmount}&tn=${encodedNote}&tr=${transactionRef}&cu=INR`;
}

/**
 * Generates Base64 Data URL for QR Code from UPI deep link
 */
export async function generateUpiQrDataUrl(upiUri: string): Promise<string> {
  try {
    return await QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 2,
      color: {
        dark: "#2A1810",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });
  } catch (error) {
    console.error("Error generating UPI QR code:", error);
    throw new Error("Failed to generate UPI QR code");
  }
}

/**
 * Builds direct WhatsApp dispatch link to +917281991952 with pre-filled order context
 */
export function buildWhatsAppOrderLink({
  orderNumber,
  customerName,
  totalAmount,
  itemsSummary,
  upiRef,
  deliveryAddress,
}: {
  orderNumber: string;
  customerName: string;
  totalAmount: number | string;
  itemsSummary: string;
  upiRef?: string | null;
  deliveryAddress: string;
}): string {
  const message = [
    `*🙏 Pranam! Order Confirmation for BIHARI BITES*`,
    `*Kitchen Dispatch Hub:* ${BRAND_ADDRESS}`,
    `*Order No:* ${orderNumber}`,
    `*Customer:* ${customerName}`,
    `*Items:* ${itemsSummary}`,
    `*Total Payable:* ₹${totalAmount}`,
    `*Payment Method:* UPI (${DEFAULT_UPI_VPA})`,
    upiRef
      ? `*UPI UTR / Ref ID:* ${upiRef}`
      : `*Payment Status:* Payment Pending / Screenshot Attached`,
    `*Delivery Address:* ${deliveryAddress}`,
    ``,
    `Please confirm the order and dispatch at the earliest. Dhanyawad!`,
  ].join("\n");

  return `https://wa.me/${BRAND_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/**
 * Validates 12-digit Indian Bank UPI UTR / RRN (Retrieval Reference Number)
 */
export function isValidUtr(utr: string): boolean {
  const sanitized = utr.trim();
  return /^[0-9A-Za-z]{12}$/.test(sanitized);
}
