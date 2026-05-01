import { z } from "zod";
import {
  insertProductSchema,
  insertProductVariantSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
} from "@/lib/validators";

// --- PRODUCT TYPES ---

export type ProductVariant = z.infer<typeof insertProductVariantSchema> & {
  id: string;
  productId: string;
};

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  createdAt: Date;
  variants: ProductVariant[];
};

// --- CART TYPES ---

export type CartItem = z.infer<typeof cartItemSchema>;

export type Cart = z.infer<typeof insertCartSchema> & {
  id: string;
  createdAt: Date;
};

// --- ORDER TYPES ---

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user?: { name: string; email: string } | null;
  paymentResult: PaymentResult | null;
};
