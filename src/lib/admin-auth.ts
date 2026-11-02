import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "bihari_admin_session";

export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export interface AdminSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  isMaster?: boolean;
}

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.ADMIN_JWT_SECRET ||
    "bihari-bites-super-secret-admin-jwt-key-2026-patna";
  return new TextEncoder().encode(secret);
}

/**
 * Creates a signed JWT session for an Admin or Super Admin (valid for 7 days)
 */
export async function createAdminToken(payload: AdminSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

/**
 * Verifies and decodes the Admin JWT session token
 */
export async function verifyAdminToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the admin session from an incoming NextRequest
 */
export async function getAdminSession(
  req: NextRequest
): Promise<AdminSessionPayload | null> {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME);
  if (!cookie?.value) return null;
  return await verifyAdminToken(cookie.value);
}
