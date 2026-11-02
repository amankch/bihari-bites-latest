import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public admin login and auth API endpoints without protection
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/auth/")
  ) {
    return NextResponse.next();
  }

  // 2. Check for protected routes (/admin/* or /api/admin/*)
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // 3. Verify Admin Session Cookie
  const session = await getAdminSession(req);

  if (!session) {
    if (isAdminApi) {
      return NextResponse.json(
        { message: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    // Redirect to /admin/login with callback URL
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Role-Based Check: Super Admin only routes
  // Route /admin/team and /api/admin/users/* strictly require SUPER_ADMIN
  const isSuperAdminRoute =
    pathname.startsWith("/admin/team") ||
    pathname.startsWith("/api/admin/users");

  if (isSuperAdminRoute && session.role !== "SUPER_ADMIN") {
    if (isAdminApi) {
      return NextResponse.json(
        {
          message:
            "Forbidden: Master Super Admin privileges are required to assign or revoke roles.",
        },
        { status: 403 }
      );
    }

    // Redirect back to main admin dashboard
    const adminUrl = new URL("/admin", req.url);
    adminUrl.searchParams.set("error", "super_admin_required");
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
