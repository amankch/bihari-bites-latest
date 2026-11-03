import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    if (!filename || filename.includes("..")) {
      return NextResponse.json({ message: "Invalid filename" }, { status: 400 });
    }

    // 1. Try local filesystem first (development or pre-bundled files)
    try {
      const possiblePaths = [
        path.join(process.cwd(), "public", "uploads", "products", filename),
        path.join(process.cwd(), "public", "uploads", filename),
      ];

      for (const filePath of possiblePaths) {
        try {
          const fileBuffer = await fs.readFile(filePath);
          const ext = path.extname(filename).toLowerCase();
          const contentType =
            ext === ".webp"
              ? "image/webp"
              : ext === ".png"
              ? "image/png"
              : ext === ".jpg" || ext === ".jpeg"
              ? "image/jpeg"
              : "application/octet-stream";

          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch {
          // Continue to next path or DB
        }
      }
    } catch {
      // Local FS read error, continue to DB lookup
    }

    // 2. Fetch from PostgreSQL database (production persistent storage)
    const media = await prisma.mediaUpload.findUnique({
      where: { filename },
    });

    if (media && media.data) {
      return new NextResponse(Buffer.from(media.data), {
        status: 200,
        headers: {
          "Content-Type": media.mimeType || "image/webp",
          "Content-Length": media.size.toString(),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return NextResponse.json({ message: "Image not found" }, { status: 404 });
  } catch (error: any) {
    console.error("Error serving uploaded media:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
