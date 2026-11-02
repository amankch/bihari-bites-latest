import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const VALID_ROLES = ["SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession(req);

    // 1. Strict Super Admin Check
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          message:
            "Forbidden: Only a Master Super Admin can assign or revoke roles.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { role } = body;

    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        {
          message: `Invalid role specified. Must be one of: ${VALID_ROLES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Safety guard: Super Admin cannot demote their own account to prevent lockout
    if (session.userId === targetUser.id && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          message:
            "Safety Guard: You cannot demote your own Super Admin account to avoid being locked out of the store.",
        },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: role as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${updatedUser.name} has been updated to role ${updatedUser.role}.`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to update role" },
      { status: 500 }
    );
  }
}
