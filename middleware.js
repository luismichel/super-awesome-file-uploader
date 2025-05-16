import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("test");
  if (request.nextUrl.pathname === "/") {
    console.log("test");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
