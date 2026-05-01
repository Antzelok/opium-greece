import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const AuthConfig = {
  providers: [], // Empty array, defined in auth.ts
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      // Array of regex patterns for protected paths
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // Get pathname from request URL
      const { pathname } = request.nextUrl;

      // 1. Check if user is authenticated for protected paths
      if (!auth && protectedPaths.some((p) => p.test(pathname))) {
        return false; // Redirects to sign-in page automatically
      }

      // 2. Handle sessionCartId cookie generation
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        const response = NextResponse.next();

        // Set the sessionCartId cookie in the response
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      }

      return true; // Allow access
    },
  },
} satisfies NextAuthConfig;
