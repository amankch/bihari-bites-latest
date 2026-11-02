"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, KeyRound, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const errorParam = searchParams.get("error");

  const [mode, setMode] = useState<"master" | "staff">("master");
  const [masterKey, setMasterKey] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    errorParam === "super_admin_required"
      ? "Master Super Admin role is required to access that section."
      : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const payload =
        mode === "master"
          ? { masterKey }
          : { email };

      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to authenticate.");
      }

      // Redirect to target admin route
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-bihari-terracotta group-hover:text-bihari-haldi transition-colors">
              BIHARI BITES
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-bihari-mustard">
              Swad Asli • Crunch Desi
            </span>
          </Link>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 border border-amber-900/10 px-3 py-1 text-xs font-bold text-bihari-dark">
              <Lock className="h-3.5 w-3.5 text-bihari-terracotta" /> Guarded Admin Gateway
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-amber-900/10 bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-bihari-dark">
              Admin Authentication
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Sign in with your Master Key or assigned Admin account to manage store inventory, orders, and roles.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-amber-50/80 border border-amber-900/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode("master");
                setErrorMsg("");
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "master"
                  ? "bg-bihari-terracotta text-white shadow-sm"
                  : "text-neutral-600 hover:text-bihari-dark"
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" /> Super Admin Key
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("staff");
                setErrorMsg("");
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === "staff"
                  ? "bg-bihari-terracotta text-white shadow-sm"
                  : "text-neutral-600 hover:text-bihari-dark"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Staff Email
            </button>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-red-50 border border-red-200/60 p-3.5 text-xs text-red-600 font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "master" ? (
              <div className="space-y-1.5">
                <Label htmlFor="masterKey" className="text-xs font-bold text-neutral-800">
                  Master Super Admin Passcode *
                </Label>
                <Input
                  id="masterKey"
                  type="password"
                  placeholder="Enter Master Security Key..."
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  className="rounded-xl border-amber-900/20 text-xs font-mono"
                  required
                />
                <p className="text-[11px] text-neutral-400">
                  Configured in <code className="text-bihari-terracotta">ADMIN_MASTER_KEY</code>
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-neutral-800">
                  Assigned Admin Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. operations@biharibites.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-amber-900/20 text-xs"
                  required
                />
                <p className="text-[11px] text-neutral-400">
                  Must be granted the <span className="font-semibold text-bihari-dark">ADMIN</span> or <span className="font-semibold text-bihari-dark">SUPER_ADMIN</span> role by Master Admin.
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl font-bold bg-bihari-terracotta hover:bg-[#9a2b1c] text-white shadow-md gap-2"
            >
              {isLoading ? "Authenticating..." : "Unlock Admin Dashboard"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="pt-2 border-t border-amber-900/10 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-neutral-500 hover:text-bihari-terracotta transition-colors"
            >
              ← Back to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center text-xs text-neutral-500">
          Loading guarded gateway...
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
