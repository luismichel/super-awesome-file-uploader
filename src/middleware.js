import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Special case: redirect from "/" to login or dashboard
  if (pathname === "/") {
    const redirectUrl = new URL(token ? "/dashboard" : "/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  const protectedRoutes = ["/dashboard", "/api/protected"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/protected/:path*"],
};
