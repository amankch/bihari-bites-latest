"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  LogOut,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminUserSession {
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  isMaster?: boolean;
}

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AdminUserSession | null>(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
        }
      } catch {}
    }
    loadSession();
  }, []);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to lock and sign out of the Admin panel?")) {
      try {
        await fetch("/api/admin/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      } catch {
        router.push("/admin/login");
      }
    }
  };

  const isSuperAdmin = session?.role === "SUPER_ADMIN";

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders & UPIs", href: "/admin/orders", icon: ShoppingCart },
    { label: "Delicacies Inventory", href: "/admin/products", icon: Package },
    { label: "Add Delicacy", href: "/admin/products/new", icon: Package },
    { label: "Customers CRM", href: "/admin/customers", icon: Users },
    ...(isSuperAdmin
      ? [{ label: "Team & Role Access", href: "/admin/team", icon: UserCog, highlight: true }]
      : []),
  ];

  return (
    <aside className="w-full md:w-64 bg-bihari-dark text-[#FFFDF7] p-6 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            {isSuperAdmin ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-bihari-dark text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                <Crown className="h-3 w-3" /> Master Super Admin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="h-3 w-3" /> Operations Admin
              </span>
            )}
          </div>

          <h2 className="font-serif text-xl font-bold tracking-tight text-white">
            BIHARI BITES:
          </h2>
          <p className="text-xs text-neutral-400 truncate">
            {session ? session.name : "Guarded Admin Console"}
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "bg-bihari-terracotta text-white shadow-md"
                    : item.highlight
                    ? "text-amber-300 hover:bg-amber-500/20 bg-amber-500/10"
                    : "text-neutral-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-white/10 space-y-3">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out of Admin
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-amber-400 px-3 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Exit to Storefront
        </Link>
      </div>
    </aside>
  );
}
