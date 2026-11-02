export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  weight: string;
  price: number | string;
  mrp: number | string;
  stock: number;
  sku: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string | null;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description: string;
  ingredients?: string | null;
  features: string[];
  shelfLife?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  slug: string;
  weight: string;
  price: number;
  mrp: number;
  quantity: number;
  imageUrl?: string;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING_VERIFICATION"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface PaymentDetails {
  id: string;
  orderId: string;
  method: "UPI" | "COD";
  amount: number | string;
  upiVpa: string;
  upiTxnRef?: string | null;
  status: PaymentStatus;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  variant: ProductVariant & { product: { name: string; slug: string } };
  quantity: number;
  price: number | string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  addressId: string;
  address: Address;
  totalAmount: number | string;
  shippingFee: number | string;
  discountAmount: number | string;
  finalAmount: number | string;
  status: OrderStatus;
  items: OrderItem[];
  payment?: PaymentDetails | null;
  customerNotes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  pendingUpiOrders: number;
  activeProducts: number;
  recentOrders: Order[];
}
