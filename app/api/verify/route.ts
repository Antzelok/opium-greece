import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) return new NextResponse("Token missing", { status: 400 });

  const vToken = await prisma.verificationToken.findFirst({ where: { token } });

  if (!vToken || vToken.expires < new Date()) {
    return new NextResponse("Invalid or expired token", { status: 400 });
  }

  await prisma.user.update({
    where: { email: vToken.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: {
      identifier_token: { identifier: vToken.identifier, token: vToken.token },
    },
  });

  return NextResponse.redirect(
    new URL("/sign-in?verified=true", process.env.NEXT_PUBLIC_SERVER_URL),
  );
}
