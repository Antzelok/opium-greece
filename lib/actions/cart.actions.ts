"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import {
  cartItemSchema,
  insertCartSchema,
  shippingAddressSchema,
} from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import z from "zod";

/**
 * Calculate cart prices based on items and shipping location
 * Greece: Free over 60€, otherwise 5€
 * Cyprus: Free over 80€, otherwise 10€ (example)
 */
const calcPrice = (items: CartItem[], country: string = "GR") => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  );

  let shippingPrice = 0;
  if (country === "CY") {
    shippingPrice = itemsPrice > 80 ? 0 : 10;
  } else {
    // Default to Greece (GR)
    shippingPrice = itemsPrice > 60 ? 0 : 5;
  }

  const totalPrice = round2(itemsPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function AddItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await getMyCart();
    const item = cartItemSchema.parse(data);

    // 1. Verify that the Variant exists in the database
    const variant = await prisma.productVariant.findFirst({
      where: { id: item.variantId },
      include: { product: true },
    });

    if (!variant) throw new Error("Product variant not found");

    if (!cart) {
      // Create new cart if it doesn't exist
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({
        data: newCart,
      });

      revalidatePath(`/product/${variant.product.slug}`);

      return {
        success: true,
        message: `${item.name} added to cart`,
      };
    } else {
      // 2. Check if the specific Variant already exists in the cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.variantId === item.variantId,
      );

      if (existItem) {
        // Increment quantity
        (cart.items as CartItem[]).find(
          (x) => x.variantId === item.variantId,
        )!.qty = existItem.qty + 1;
      } else {
        // Add new item to the items array
        cart.items.push(item);
      }

      // 3. Update cart in database with recalculated prices
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${variant.product.slug}`);

      return {
        success: true,
        message: `${item.name} ${existItem ? "updated in" : "added to"} cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) return undefined;

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
  });
}

export async function RemoveItemFromCart(variantId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    const exist = (cart.items as CartItem[]).find(
      (x) => x.variantId === variantId,
    );
    if (!exist) throw new Error("Item not found in cart");

    if (exist.qty === 1) {
      // Remove item completely
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.variantId !== variantId,
      );
    } else {
      // Decrease quantity
      (cart.items as CartItem[]).find((x) => x.variantId === variantId)!.qty =
        exist.qty - 1;
    }

    // Update database with recalculated prices
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath("/cart");

    return {
      success: true,
      message: "Cart updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function AddMultipleItemsToCart(items: CartItem[]) {
  try {
    if (items.length === 0) {
      throw new Error("No items to add");
    }

    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Filter items with qty > 0
    const validItems = items.filter((item) => item.qty > 0);
    if (validItems.length === 0) {
      throw new Error("No valid items to add");
    }

    // Validate all items
    validItems.forEach((item) => {
      cartItemSchema.parse(item);
    });

    const cart = await getMyCart();

    if (!cart) {
      // Create new cart if it doesn't exist
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: validItems,
        sessionCartId: sessionCartId,
        ...calcPrice(validItems),
      });

      await prisma.cart.create({
        data: newCart,
      });

      revalidatePath("/");

      return {
        success: true,
        message: `${validItems.length} item(s) added to cart`,
      };
    } else {
      // Add/update items in existing cart
      const cartItems = cart.items as CartItem[];

      validItems.forEach((newItem) => {
        const existItem = cartItems.find(
          (x) => x.variantId === newItem.variantId,
        );

        if (existItem) {
          existItem.qty += newItem.qty;
        } else {
          cartItems.push(newItem);
        }
      });

      // Update cart in database with recalculated prices
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cartItems as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cartItems),
        },
      });

      revalidatePath("/");

      return {
        success: true,
        message: `${items[0].name} ${items[0].type} added to cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateCartGuestEmail(email: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      return { success: false, message: "Cart session not found" };
    }

    await prisma.cart.update({
      where: { sessionCartId: sessionCartId },
      data: { guestEmail: email },
    });

    revalidatePath("/check-out");
    return { success: true };
  } catch (error) {
    console.error("PRISMA_UPDATE_ERROR:", error);
    return { success: false, message: "Failed to update email" };
  }
}

export async function updateCartShippingAddress(
  data: z.infer<typeof shippingAddressSchema>,
) {
  try {
    // 1. Get the session cart ID from cookies
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) {
      return { success: false, message: "Cart session not found" };
    }

    // 2. Validate the incoming data against the Zod schema
    const validatedAddress = shippingAddressSchema.parse(data);

    // 3. Find the current cart in the database to get the itemsPrice
    const cart = await prisma.cart.findUnique({
      where: { sessionCartId: sessionCartId },
    });

    if (!cart) {
      return { success: false, message: "Cart not found" };
    }

    // 4. Calculate shipping fee based on the selected method (2.00€ for ELTA or BoxNow)
    const shippingPrice =
      validatedAddress.shippingMethod === "elta" ||
      validatedAddress.shippingMethod === "boxnow"
        ? 2.0
        : 0.0;

    // 5. Calculate the new total price
    const itemsPrice = Number(cart.itemsPrice);
    const newTotalPrice = itemsPrice + shippingPrice;

    // 6. Update the cart with the shipping address, shipping price, and new total price
    await prisma.cart.update({
      where: { sessionCartId: sessionCartId },
      data: {
        shippingAddress: validatedAddress as unknown as Prisma.InputJsonValue,
        shippingPrice: shippingPrice,
        totalPrice: newTotalPrice,
      },
    });

    // 7. Revalidate checkout pages to reflect changes instantly in the UI
    revalidatePath("/shipping-address");
    revalidatePath("/payment-method");
    revalidatePath("/place-order");

    return {
      success: true,
      message: "Shipping address and prices updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateCartShippingMethod(shippingMethod: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId)
      return { success: false, message: "Cart session not found" };

    const cart = await prisma.cart.findUnique({ where: { sessionCartId } });
    if (!cart) return { success: false, message: "Cart not found" };

    const shippingPrice =
      shippingMethod === "elta" || shippingMethod === "boxnow" ? 2.0 : 0.0;
    const newTotalPrice = Number(cart.itemsPrice) + shippingPrice;

    await prisma.cart.update({
      where: { sessionCartId },
      data: {
        shippingPrice,
        totalPrice: newTotalPrice,
        shippingAddress: { shippingMethod },
      },
    });

    revalidatePath("/shipping-address");
    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
