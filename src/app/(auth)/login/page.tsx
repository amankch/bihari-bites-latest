"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, Mail, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"otp" | "google">("otp");
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"enter-contact" | "enter-otp">("enter-contact");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in with Google.");
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg("Please enter your email or mobile number.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      // Demo OTP simulator for quick login
      setTimeout(() => {
        setIsLoading(false);
        setStep("enter-otp");
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send OTP.");
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 4) {
      setErrorMsg("Please enter the complete OTP code.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      // In production, Better Auth verify OTP endpoint is triggered
      setTimeout(() => {
        setIsLoading(false);
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid OTP entered.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-14rem)]">
      <div className="w-full max-w-md rounded-3xl border border-amber-900/10 bg-white p-8 shadow-xl space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-bihari-terracotta mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Store
          </Link>

          <div className="text-center space-y-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#FFFDF7] p-1 border border-amber-900/10 shadow-sm flex items-center justify-center">
              <img
                src="/images/logo-emblem.svg"
                alt="Bihari Bites Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-bihari-dark">
              Welcome to BIHARI BITES:
            </h1>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold text-bihari-mustard">
              Swad Asli • Crunch Desi
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Google 1-Click Sign-In */}
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full rounded-xl border-amber-900/20 bg-white hover:bg-amber-50/60 font-semibold text-neutral-800 gap-2 h-11"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-amber-900/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-neutral-400 font-bold">Or Sign In with OTP</span>
          </div>
        </div>

        {/* OTP Flow */}
        {step === "enter-contact" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="contact">Mobile Number or Email</Label>
              <Input
                id="contact"
                type="text"
                placeholder="e.g. 7281991952 or anand@biharibites.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <p className="text-[10px] text-neutral-500">We will send a 4-digit verification passcode.</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl font-bold h-11"
            >
              {isLoading ? "Sending OTP..." : "Send Verification OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="otp">Enter 4-Digit Passcode</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="• • • •"
                className="text-center text-lg font-mono tracking-widest"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
              />
              <div className="flex justify-between items-center text-[10px] text-neutral-500 pt-1">
                <span>Sent to: {identifier}</span>
                <button
                  type="button"
                  onClick={() => setStep("enter-contact")}
                  className="text-bihari-terracotta hover:underline font-bold"
                >
                  Change
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl font-bold h-11 bg-emerald-700 hover:bg-emerald-800"
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </Button>
          </form>
        )}

        <div className="pt-2 border-t border-amber-900/10 text-center">
          <p className="text-[11px] text-neutral-500">
            By signing in, you agree to receive order notifications and delivery status on WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
