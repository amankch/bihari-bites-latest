import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { masterKey, email } = body;

    const configuredMasterKey =
      process.env.ADMIN_MASTER_KEY || "BihariBites@SuperAdmin2026!";

    // 1. MASTER SUPER ADMIN KEY LOGIN
    if (masterKey && masterKey.trim() === configuredMasterKey.trim()) {
      // Async non-blocking upsert to Neon DB so cold start never freezes login response
      prisma.user
        .upsert({
          where: { email: "superadmin@biharibites.com" },
          update: { role: "SUPER_ADMIN" },
          create: {
            name: "Master Super Admin",
            email: "superadmin@biharibites.com",
            role: "SUPER_ADMIN",
            phone: "+917281991952",
          },
        })
        .catch((err) => console.warn("Background user sync on login:", err?.message || err));

      const token = await createAdminToken({
        userId: "cmvzoimux0000cw2ws0s9hltx",
        email: "superadmin@biharibites.com",
        name: "Master Super Admin",
        role: "SUPER_ADMIN",
        isMaster: true,
      });

      const res = NextResponse.json({
        success: true,
        message: "Welcome, Master Super Admin. Access granted.",
        user: {
          name: "Master Super Admin",
          email: "superadmin@biharibites.com",
          role: "SUPER_ADMIN",
        },
      });

      // Set secure HTTP-Only cookie for 7 days
      res.cookies.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    // 2. STAFF / TEAM EMAIL LOGIN
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        return NextResponse.json(
          { message: "No account found with this email address." },
          { status: 401 }
        );
      }

      // Check if user has admin privileges
      if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        return NextResponse.json(
          {
            message:
              "Access Denied: This account does not have Admin or Super Admin privileges. Contact the Master Admin.",
          },
          { status: 403 }
        );
      }

      const token = await createAdminToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role as "ADMIN" | "SUPER_ADMIN",
        isMaster: false,
      });

      const res = NextResponse.json({
        success: true,
        message: `Welcome back, ${user.name}.`,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

      res.cookies.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    return NextResponse.json(
      { message: "Invalid credentials. Please provide valid Master Key or Admin Email." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
