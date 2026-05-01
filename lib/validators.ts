import { z } from "zod";
import { PAYMENT_METHODS } from "./constants";
import { formatNumberWithDecimal } from "./utils";

const currency = z.coerce
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Η τιμή πρέπει να έχει ακριβώς δύο δεκαδικά ψηφία",
  );

// --- PRODUCT & VARIANT SCHEMAS ---

export const insertProductVariantSchema = z.object({
  name: z.string().min(1, "Το όνομα του variant είναι υποχρεωτικό"),
  type: z.enum(["SIZE", "ADDON"]),
  price: currency,
});

export const insertProductSchema = z.object({
  name: z.string().min(3, "Το όνομα πρέπει να είναι τουλάχιστον 3 χαρακτήρες"),
  slug: z.string().min(3, "Το slug πρέπει να είναι τουλάχιστον 3 χαρακτήρες"),
  category: z
    .string()
    .min(3, "Η κατηγορία πρέπει να είναι τουλάχιστον 3 χαρακτήρες"),
  brand: z.string().min(3, "Η μάρκα πρέπει να είναι τουλάχιστον 3 χαρακτήρες"),
  description: z
    .string()
    .min(3, "Η περιγραφή πρέπει να είναι τουλάχιστον 3 χαρακτήρες"),
  images: z
    .array(z.string())
    .min(1, "Το προϊόν πρέπει να έχει τουλάχιστον μία εικόνα"),
  variants: z
    .array(insertProductVariantSchema)
    .min(1, "Πρέπει να ορίσετε τουλάχιστον μία επιλογή"),
});

// --- CART SCHEMAS ---

export const cartItemSchema = z.object({
  variantId: z.string().min(1, "Το Variant ID είναι υποχρεωτικό"),
  productId: z.string().min(1, "Το Product ID είναι υποχρεωτικό"),
  name: z.string().min(1, "Το όνομα είναι υποχρεωτικό"),
  slug: z.string().min(1, "Το slug είναι υποχρεωτικό"),
  qty: z
    .number()
    .int()
    .nonnegative("Η ποσότητα πρέπει να είναι θετικός αριθμός"),
  image: z.string().min(1, "Η εικόνα είναι υποχρεωτική"),
  price: currency,
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
  fullName: z.string().min(3, "Το ονοματεπώνυμο είναι υποχρεωτικό"),
  streetAddress: z.string().min(3, "Η διεύθυνση είναι υποχρεωτική"),
  city: z.string().min(3, "Η πόλη είναι υποχρεωτική"),
  postalCode: z.string().min(3, "Ο ταχυδρομικός κώδικας είναι υποχρεωτικός"),
  country: z.string().min(3, "Η χώρα είναι υποχρεωτική"),
  email: z.string().email("Το email είναι απαραίτητο").optional(),
});

export const insertOrderSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Μη έγκυρος τρόπος πληρωμής",
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
  email: z.string().email("Μη έγκυρο email"),
  password: z
    .string()
    .min(6, "Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες"),
});

export const signUpFormSchema = z
  .object({
    name: z
      .string()
      .min(3, "Το όνομα πρέπει να είναι τουλάχιστον 3 χαρακτήρες"),
    email: z.string().email("Μη έγκυρο email"),
    password: z
      .string()
      .min(6, "Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες"),
    confirmPassword: z.string().min(6, "Επιβεβαιώστε τον κωδικό"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Οι κωδικοί δεν ταιριάζουν",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Το όνομα πρέπει να είναι τουλάχιστον 3 χαρακτήρες"),
  email: z.string().email("Μη έγκυρο email"),
});

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "Το ID είναι υποχρεωτικό"),
  role: z.string().min(1, "Ο ρόλος είναι υποχρεωτικός"),
});
