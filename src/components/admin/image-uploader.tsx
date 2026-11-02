"use client";

import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label = "Product Creative / Photography" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ original: string; compressed: string; savings: number } | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    setError(null);
    setIsUploading(true);
    setStats(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      onChange(data.url);
      setStats({
        original: data.originalSize,
        compressed: data.compressedSize,
        savings: data.savingsPercent,
      });
    } catch (err: any) {
      setError(err?.message || "Error processing image creative.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-semibold text-xs text-neutral-800">{label}</Label>
        <button
          type="button"
          onClick={() => setMode(mode === "upload" ? "url" : "upload")}
          className="text-[11px] font-bold text-bihari-terracotta hover:underline"
        >
          {mode === "upload" ? "Switch to URL / Path" : "Switch to File Upload"}
        </button>
      </div>

      {mode === "upload" ? (
        <div className="space-y-3">
          {/* Dropzone Container */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isUploading
                ? "border-bihari-terracotta bg-amber-50/50 cursor-wait"
                : "border-amber-900/20 hover:border-bihari-terracotta hover:bg-amber-50/30 bg-white"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />

            {isUploading ? (
              <div className="flex flex-col items-center justify-center space-y-2 py-4">
                <Loader2 className="h-8 w-8 animate-spin text-bihari-terracotta" />
                <p className="text-xs font-bold text-bihari-dark">
                  Compressing with Sharp (Auto-WebP 1000px)...
                </p>
                <p className="text-[11px] text-neutral-500">
                  Resizing, stripping heavy camera EXIF & optimizing quality
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 py-2">
                <div className="rounded-full bg-amber-100/70 p-3 text-bihari-terracotta">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-neutral-800">
                  Click to upload product creative or drag and drop
                </p>
                <p className="text-[11px] text-neutral-500">
                  PNG, JPG, or WebP up to 25MB • Automatically compressed down to &lt; 100KB WebP
                </p>
              </div>
            )}
          </div>

          {/* Success Statistics Banner */}
          {stats && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200/60 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Auto-Compressed:</strong> {stats.original} ➔{" "}
                <span className="text-emerald-950 font-bold">{stats.compressed}</span> ({stats.savings}% bandwidth saved)!
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Manual URL input */
        <div className="space-y-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. /images/products/thekua.jpg or https://images.unsplash.com/..."
            className="text-xs"
          />
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-900/10">
          <img
            src={value}
            alt="Product Preview"
            className="h-16 w-16 object-cover rounded-xl border border-amber-900/10 bg-white shrink-0 shadow-sm"
          />
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-bihari-dark truncate">Active Creative Asset</p>
            <p className="text-[11px] text-neutral-500 truncate">{value}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold gap-1 text-bihari-terracotta"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Replace
          </Button>
        </div>
      )}
    </div>
  );
}
