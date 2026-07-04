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
  id: z.string().default(""),
  productId: z.string().default(""),
  size: z.string().min(1, "Size is required (e.g., 100ml or Standard)"),
  type: z.enum(
    ["Perfume", "Lotion", "Gel", "Oil", "Beard Oil", "Car Fragrance"],
    {
      message: "Please select a valid product type",
    },
  ),
  price: currency,
});

export const insertProductSchema = z.object({
  id: z.string().default(""),
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

// --- CART SCHEMAS ---
export const cartItemSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.enum(["Men", "Women", "Niche", "Unisex"], {
    message: "Invalid category",
  }),
  image: z.string().min(1, "Image is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.string(),
  qty: z.number().int().nonnegative(),
  size: z.string().min(1, "Size is required"),
  type: z.string().min(1, "Type is required"),
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  sessionCartId: z.string().min(1, "Session cart ID is required"),
  userId: z.string().uuid().optional().nullable(),
  guestEmail: z.string().email().optional().nullable(),
});

export const shippingAddressSchema = z
  .object({
    shippingMethod: z.string().min(1, "Επιλέξτε μέθοδο"),
    firstName: z.string().min(2, "Το όνομα είναι υποχρεωτικό"),
    lastName: z.string().min(2, "Το επώνυμο είναι υποχρεωτικό"),
    email: z.string().email("Μη έγκυρο email"),
    phoneNumber: z.string().min(10, "Το τηλέφωνο είναι υποχρεωτικό"),
    country: z.string().optional().or(z.literal("")),
    municipality: z.string().optional().or(z.literal("")),
    city: z.string().optional().or(z.literal("")),
    streetName: z.string().optional().or(z.literal("")),
    streetNumber: z.string().optional().or(z.literal("")),
    postalCode: z.string().optional().or(z.literal("")),
    boxnowLockerId: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.shippingMethod === "elta") {
      if (!data.country || data.country.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Η χώρα είναι υποχρεωτική",
          path: ["country"],
        });
      }
      if (!data.municipality || data.municipality.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ο δήμος είναι υποχρεωτικός",
          path: ["municipality"],
        });
      }
      if (!data.city || data.city.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Η πόλη είναι υποχρεωτική",
          path: ["city"],
        });
      }
      if (!data.streetName || data.streetName.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Η οδός είναι υποχρεωτική",
          path: ["streetName"],
        });
      }
      if (!data.streetNumber || data.streetNumber.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ο αριθμός είναι υποχρεωτικός",
          path: ["streetNumber"],
        });
      }
      if (!data.postalCode || data.postalCode.length !== 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ο Τ.Κ. πρέπει να είναι 5 ψηφία",
          path: ["postalCode"],
        });
      }
    }

    // Αν επιλέξει BoxNow
    if (data.shippingMethod === "boxnow") {
      if (!data.boxnowLockerId || data.boxnowLockerId.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Επιλέξτε θυρίδα BoxNow",
          path: ["boxnowLockerId"],
        });
      }
    }
  });

// --- ORDER SCHEMAS ---
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
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

// --- AUTH & PROFILE SCHEMAS ---
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
