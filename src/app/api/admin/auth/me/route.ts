import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, session: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    session: {
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      isMaster: Boolean(session.isMaster),
    },
  });
}
