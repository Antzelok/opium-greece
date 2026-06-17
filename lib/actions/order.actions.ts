"use server";

import { auth } from "@/auth";
import { cookies } from "next/headers"; // 👑 ΠΡΟΣΘΗΚΗ IMPORT ΓΙΑ ΤΑ COOKIES
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { convertToPlainObject, formatError } from "../utils";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult, ShippingAddress } from "@/types";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { sendPurchaseReceipt } from "@/email";

export async function createOrder(paymentMethod: string) {
  try {
    const session = await auth();
    const cart = await getMyCart();

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Το καλάθι σας είναι άδειο.",
        redirectTo: "/cart",
      };
    }

    const userId = session?.user?.id || null;
    
    // Έλεγχος αν είναι Guest: Αν δεν υπάρχει userId, πρέπει οπωσδήποτε να έχουμε guestEmail στο καλάθι
    if (!userId && !cart.guestEmail) {
      return {
        success: false,
        message: "Παρακαλώ εισάγετε το email σας για να προχωρήσετε ως επισκέπτης.",
        redirectTo: "/check-out", // Ή όπου ζητάς το email του guest
      };
    }

    // Παίρνουμε τη διεύθυνση από το καλάθι
    let shippingAddress = cart.shippingAddress;

    if (!shippingAddress && userId) {
      const user = await getUserById(userId);
      if (user && user.address) {
        shippingAddress = user.address;
      }
    }

    if (!shippingAddress) {
      return {
        success: false,
        message: "Δεν βρέθηκαν στοιχεία αποστολής.",
        redirectTo: "/check-out/shipping-address",
      };
    }

    const orderItems = (cart.items as CartItem[]).map((item) => ({
      name: item.name,
      slug: item.slug || item.name.toLowerCase().replace(/ /g, "-"),
      image: item.image,
      price: item.price,
      qty: item.qty,
      variantId: item.variantId,
    }));

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          guestEmail: userId ? null : cart.guestEmail, // Αποθήκευση του email αν είναι guest
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
          isPaid: false,
          isDelivered: false,
          orderitems: {
            create: orderItems,
          },
        },
      });

      // Διαγραφή καλαθιού μετά την επιτυχημένη παραγγελία
      await tx.cart.delete({
        where: { id: cart.id },
      });

      return newOrder.id;
    });

    if (!insertedOrderId)
      throw new Error("Η δημιουργία της παραγγελίας απέτυχε.");

    // 👑 ΚΑΘΑΡΙΣΜΟΣ COOKIE & REDIRECT ΣΤΗΝ ΑΡΧΙΚΗ (/)
    const cookieStore = await cookies();
    cookieStore.delete("sessionCartId");

    return {
      success: true,
      message: "Η παραγγελία δημιουργήθηκε με επιτυχία.",
      redirectTo: "/", // <-- Σε πετάει κατευθείαν στο /
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
}

// Get user's orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error("User is not authorized");

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

// Get sales data and order summary
export async function getOrderSummary() {
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

// Get all orders
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== "all"
      ? {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
        }
      : {};

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete an order
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } });

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update order to paid
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderitems: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.isPaid) throw new Error("Order is already paid");

  await prisma.order.update({
    where: { id: orderId },
    data: {
      isPaid: true,
      paidAt: new Date(),
      paymentResult,
    },
  });

  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error("Order not found");

  sendPurchaseReceipt({
    order: {
      ...updatedOrder,
      shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
      paymentResult: updatedOrder.paymentResult as PaymentResult,
    },
  });

  revalidatePath("/admin/orders");
}