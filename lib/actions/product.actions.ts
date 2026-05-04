"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { insertProductSchema } from "../validators";
import z from "zod";
import { Prisma } from "@prisma/client";
import { Product } from "@/types";

// Get latest products with their variants
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
    include: { variants: true },
  });
  return convertToPlainObject(data);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const data = await prisma.product.findMany({
    where: {
      category: category,
    },
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Κάνουμε cast σε unknown και μετά σε Product[] για να "ηρεμήσουμε" το TS
  // αφού εμπιστευόμαστε ότι η βάση έχει σωστές τιμές λόγω Zod validation στο insert
  return convertToPlainObject(data) as Product[];
}

// Get single product by its slug with variants
export async function getProductBySlug(slug: string) {
  const data = await prisma.product.findFirst({
    where: { slug: slug },
    include: { variants: true },
  });

  return convertToPlainObject(data);
}

// Get single product by its ID
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
    include: { variants: true },
  });

  return convertToPlainObject(data);
}

// Get all products (Admin & Search) with query, category, and price filters
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  sort?: string;
}) {
  // Name search filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== "all" ? { category } : {};

  // Price filter targeting nested Product Variants
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          variants: {
            some: {
              price: {
                gte: Number(price.split("-")[0]),
                lte: Number(price.split("-")[1]),
              },
            },
          },
        }
      : {};

  // Sorting logic based on creation date
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  }

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
    },
    include: { variants: true },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
    },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete product and its variants (Cascade deletion)
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create new product with nested variants
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);

    await prisma.product.create({
      data: {
        ...product,
        variants: {
          create: product.variants,
        },
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all available product categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
}

// Get featured products (Returns latest products as a general list)
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
    take: LATEST_PRODUCTS_LIMIT,
  });

  return convertToPlainObject(data);
}
