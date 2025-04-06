import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes and their required roles
const protectedRoutes = {
  "/teacher-dashboard": ["teacher"],
  "/teacher/assignments": ["teacher"],
  "/teacher/students": ["teacher"],
  "/teacher/analytics": ["teacher"],
  "/student-dashboard": ["student"],
  "/student/assignments": ["student"],
  "/upload": ["student"],
  "/chat": ["student", "teacher"],
  "/settings": ["student", "teacher"],
};

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("user")?.value;

  // If there's no user and the path is protected, redirect to login
  if (!currentUser && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If there's a user, check role-based access
  if (currentUser) {
    const user = JSON.parse(currentUser);
    const path = request.nextUrl.pathname;

    if (isProtectedRoute(path) && !hasAccess(user.role, path)) {
      // Redirect to appropriate dashboard if unauthorized
      return NextResponse.redirect(
        new URL(
          user.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard",
          request.url
        )
      );
    }
  }

  return NextResponse.next();
}

function isProtectedRoute(path: string): boolean {
  return Object.keys(protectedRoutes).some((route) => path.startsWith(route));
}

function hasAccess(role: string, path: string): boolean {
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (path.startsWith(route)) {
      return allowedRoles.includes(role);
    }
  }
  return true;
}

export const config = {
  matcher: [
    "/teacher-dashboard/:path*",
    "/teacher/:path*",
    "/student-dashboard/:path*",
    "/student/:path*",
    "/upload/:path*",
    "/chat/:path*",
    "/settings/:path*",
  ],
}; 