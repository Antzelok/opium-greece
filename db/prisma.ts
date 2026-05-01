import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import {
  PrismaClient,
  Cart,
  Order,
  OrderItem,
  ProductVariant,
} from "../lib/generated/prisma";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    productVariant: {
      price: {
        compute(variant: ProductVariant) {
          return variant.price.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart: Cart) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart: Cart) {
          return cart.shippingPrice.toString();
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart: Cart) {
          return cart.totalPrice.toString();
        },
      },
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(order: Order) {
          return order.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(order: Order) {
          return order.shippingPrice.toString();
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(order: Order) {
          return order.totalPrice.toString();
        },
      },
    },
    orderItem: {
      price: {
        compute(orderItem: OrderItem) {
          return orderItem.price.toString();
        },
      },
    },
  },
});
