import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No image file provided." },
        { status: 400 }
      );
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Uploaded file must be a valid image (JPEG, PNG, WebP, etc.)." },
        { status: 400 }
      );
    }

    // Limit maximum upload size to 25MB (will be compressed down to < 100KB)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image is too large. Maximum allowed is 25MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);
    const originalBytes = inputBuffer.length;

    // Generate safe clean slugified filename
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40) || "delicacy";

    const timestamp = Date.now();
    const outputFileName = `${baseName}-${timestamp}.webp`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");

    await fs.mkdir(uploadsDir, { recursive: true });

    const outputPath = path.join(uploadsDir, outputFileName);

    // Auto-compress, resize to 1000x1000 square, convert to WebP, strip heavy EXIF
    const compressedBuffer = await sharp(inputBuffer)
      .rotate() // auto-orient based on EXIF before stripping
      .resize(1000, 1000, {
        fit: "cover",
        position: "center",
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
        effort: 4,
      })
      .toBuffer();

    await fs.writeFile(outputPath, compressedBuffer);

    const compressedBytes = compressedBuffer.length;
    const savingsPercent = Math.max(
      0,
      Math.round(((originalBytes - compressedBytes) / originalBytes) * 100)
    );

    const formatBytes = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return NextResponse.json({
      url: `/uploads/products/${outputFileName}`,
      filename: outputFileName,
      originalSize: formatBytes(originalBytes),
      compressedSize: formatBytes(compressedBytes),
      savingsPercent,
      message: `Image successfully compressed from ${formatBytes(originalBytes)} down to ${formatBytes(compressedBytes)} (${savingsPercent}% reduction).`,
    });
  } catch (error: any) {
    console.error("Error compressing and uploading product creative:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to process image." },
      { status: 500 }
    );
  }
}
