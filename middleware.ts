/* eslint-disable @typescript-eslint/no-unused-vars */
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const payload = await decrypt(token);

      if (!payload && !isPublicPath) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (payload && isPublicPath) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Role-based access control
      const roleBasedPaths: Record<string, string[]> = {
        ADMIN: [
          "/students",
          "/departments",
          "/timetables",
          "/timetable",
          "/messages",
          "/notifications",
          "/profile",
        ],
        TEACHER: ["/cohorts", "/assignments", "/timetable", "/timetables"],
        STUDENT: [
          "/course",
          "/assignments",
          "/timetable",
          "/messages",
          "/course",
          "/notifications",
          "/profile",
        ],
      };

      const userRole = payload!.role as keyof typeof roleBasedPaths;
      if (userRole && request.nextUrl.pathname !== "/") {
        const allowedPaths = roleBasedPaths[userRole] || [];
        const isPathAllowed = allowedPaths.some((path) =>
          request.nextUrl.pathname.startsWith(path)
        );

        if (!isPathAllowed && !isPublicPath) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      }
    } catch (error) {
      if (!isPublicPath) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
