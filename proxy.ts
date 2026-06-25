import NextAuth from "next-auth";
import { AuthConfig } from "./auth.config";

// We initialize NextAuth with our config
const { auth } = NextAuth(AuthConfig);

// We export the auth function as the middleware
export default auth;

export const config = {
  // Matcher to skip all internal paths, api routes and static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};