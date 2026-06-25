"use server";
import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
  updateUserSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import z from "zod";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { getMyCart } from "./cart.actions";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  const data = signInFormSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  {
    /*}
  if (user && !user.emailVerified) {
    return { success: false, message: "Please verify your email first." };
  }
*/
  }
  try {
    const callbackUrl = (formData.get("callbackUrl") as string) || "/";

    await signIn("credentials", { email, password, redirectTo: callbackUrl });
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}
// Sign user out
export async function signOutUser() {
  const currentCart = await getMyCart();
  await prisma.cart.delete({ where: { id: currentCart?.id } });
  await signOut();
}

// Sign up user
// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const data = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const hashedPassword = hashSync(data.password, 10);

    const newUser = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashedPassword },
    });

    const token = randomBytes(32).toString("hex");

    await prisma.verificationToken.create({
      data: {
        identifier: data.email,
        token,
        expires: new Date(Date.now() + 3600000),
      },
    });

    // Ανάγνωση του HTML αρχείου
    const filePath = path.join(
      process.cwd(),
      "components/email/template.html",
    );
    let emailHtml = await fs.readFile(filePath, "utf8");

    // Αντικατάσταση του placeholder με το πραγματικό URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify?token=${token}`;
    emailHtml = emailHtml.replace("{{URL}}", verificationUrl);

    await resend.emails.send({
      from: "Opium <onboarding@resend.dev>",
      to: data.email,
      subject: "Verify your email",
      html: emailHtml,
    });

    return {
      success: true,
      message: "Account created! Please check your email to verify.",
    };
  } catch (error) {
    console.error("SIGN_UP_CRITICAL_ERROR:", error);
    return { success: false, message: formatError(error) };
  }
}
// Get user by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}

// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User updated succesfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(methodType: string) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    // Περνάμε το string ως object `{ type: ... }` για να περάσει το Zod validation
    const validatedData = paymentMethodSchema.parse({ type: methodType });

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: validatedData.type },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update the user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
