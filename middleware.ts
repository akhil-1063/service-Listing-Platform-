import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect professionals away from customer pages and vice-versa
    if (path.startsWith("/dashboard/professional") || path === "/onboarding") {
      if (token?.role !== "professional") {
        return NextResponse.redirect(new URL("/dashboard/customer", req.url));
      }
    }

    if (path.startsWith("/dashboard/customer")) {
      if (token?.role !== "customer") {
        return NextResponse.redirect(new URL("/dashboard/professional", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding",
  ],
};
