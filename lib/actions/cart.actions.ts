"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

interface CalcPriceResult {
  itemsPrice: string;
  shippingPrice: string;
  totalPrice: string;
}

const calcPrice = (items: CartItem[], country: string = "GR", shippingMethod: string = "") => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  );

  let shippingPrice = 0;
  if (shippingMethod === "elta" || shippingMethod === "boxnow") {
    shippingPrice = 2.0;
  } else {
    if (country === "CY") {
      shippingPrice = itemsPrice > 80 ? 0 : 10;
    } else {
      shippingPrice = itemsPrice > 60 ? 0 : 5;
    }
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

    const variant = await prisma.productVariant.findFirst({
      where: { id: item.variantId },
      include: { product: true },
    });

    if (!variant) throw new Error("Product variant not found");

    if (!cart) {
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
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.variantId === item.variantId,
      );

      if (existItem) {
        (cart.items as CartItem[]).find(
          (x) => x.variantId === item.variantId,
        )!.qty = existItem.qty + 1;
      } else {
        cart.items.push(item);
      }

      const shippingAddressObj = (cart.shippingAddress as Record<string, string | undefined>) || {};
      const currentShippingMethod = shippingAddressObj.shippingMethod || "";

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[], shippingAddressObj.country || "GR", currentShippingMethod),
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
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  if (!sessionCartId && !userId) return undefined;

  const cart = await prisma.cart.findFirst({
    where: {
      OR: [
        ...(userId ? [{ userId: userId }] : []),
        ...(sessionCartId ? [{ sessionCartId: sessionCartId }] : []),
      ],
    },
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

    const existItem = (cart.items as CartItem[]).find((x) => x.variantId === variantId);
    if (!existItem) throw new Error("Item not found in cart");

    if (existItem.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter((x) => x.variantId !== variantId);
    } else {
      (cart.items as CartItem[]).find((x) => x.variantId === variantId)!.qty = existItem.qty - 1;
    }

    const shippingAddressObj = (cart.shippingAddress as Record<string, string | undefined>) || {};
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[], shippingAddressObj.country || "GR", shippingAddressObj.shippingMethod || ""),
      },
    });

    revalidatePath("/cart");
    return { success: true, message: "Item removed from cart" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateCartShippingMethod(shippingMethod: string) {
  try {
    const cart = await getMyCart();
    if (!cart) return { success: false, message: "Cart not found" };

    const prices = calcPrice(cart.items as CartItem[], "GR", shippingMethod);
    let updatedPaymentMethod = cart.paymentMethod;
    if (shippingMethod === "boxnow") {
      updatedPaymentMethod = "Stripe";
    }

    const currentAddress = (cart.shippingAddress as Record<string, string | undefined>) || {};

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        shippingPrice: prices.shippingPrice,
        totalPrice: prices.totalPrice,
        shippingAddress: {
          ...currentAddress,
          shippingMethod,
        },
        paymentMethod: updatedPaymentMethod,
      },
    });

    revalidatePath("/check-out/shipping-address");
    revalidatePath("/check-out/payment-method");
    revalidatePath("/check-out/place-order");
    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateCartPaymentMethod(paymentMethod: string) {
  try {
    const cart = await getMyCart();
    if (!cart) return { success: false, message: "Cart not found" };

    const shippingAddressObj = (cart.shippingAddress as Record<string, string | undefined>) || {};
    if (shippingAddressObj.shippingMethod === "boxnow" && paymentMethod !== "Stripe") {
      return { success: false, message: "BoxNow requires Stripe payment." };
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { paymentMethod },
    });

    revalidatePath("/check-out/payment-method");
    revalidatePath("/check-out/place-order");
    return { success: true, message: "Payment method updated" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateCartShippingAddress(addressData: Record<string, string | number | undefined>) {
  try {
    const cart = await getMyCart();
    if (!cart) return { success: false, message: "Cart not found" };

    const currentAddress = (cart.shippingAddress as Record<string, string | undefined>) || {};

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        shippingAddress: {
          ...currentAddress,
          ...addressData,
        },
      },
    });

    revalidatePath("/check-out/payment-method");
    revalidatePath("/check-out/place-order");
    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateCartGuestEmail(email: string) {
  try {
    const cart = await getMyCart();
    if (!cart) return { success: false, message: "Cart not found" };

    await prisma.cart.update({
      where: { id: cart.id },
      data: { guestEmail: email },
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}