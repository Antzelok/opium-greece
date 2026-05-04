import { z } from "zod";
import { PAYMENT_METHODS } from "./constants";
import { formatNumberWithDecimal } from "./utils";

const currency = z.coerce
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places",
  );

// --- PRODUCT & VARIANT SCHEMAS ---

export const insertProductVariantSchema = z.object({
  size: z.string().min(1, "Name is required (e.g., 100ml or Body Lotion)"),
  type: z.enum(["Perfume", "Lotion", "Gel", "Oil", "Beard Oil", "Car Fragrance"], {
    message: "Please select a valid product type",
  }),
  price: currency,
});


export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.enum(["Men", "Women", "Niche", "Unisex"], {
    message: "Invalid category",
  }),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  variants: z
    .array(insertProductVariantSchema)
    .min(1, "At least one variant is required"),
});

export const cartItemSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.string(), // String για να περνάει το Decimal από το form
  qty: z.number().int().nonnegative(),
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  sessionCartId: z.string().min(1, "Session cart ID is required"),
  userId: z.string().uuid().optional().nullable(),
});

// --- ORDER SCHEMAS ---

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  streetAddress: z.string().min(3, "Address is required"),
  city: z.string().min(3, "City is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(3, "Country is required"),
  email: z.string().email().optional(),
});

export const insertOrderSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  variantId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number().int().nonnegative(),
});

// --- PAYMENT SCHEMAS ---
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// --- AUTH & PROFILE ---
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
});

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required"),
});
