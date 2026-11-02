"use client";

import { useEffect, useState } from "react";
import {
  Crown,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Users,
  Search,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF" | "CUSTOMER";
  createdAt: string;
  orderCount: number;
}

export default function AdminTeamPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to load team members");
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not retrieve user directory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string, userName: string) => {
    const confirmText =
      newRole === "CUSTOMER"
        ? `Are you sure you want to REVOKE admin privileges for "${userName}"? They will become a standard customer.`
        : `Are you sure you want to grant "${userName}" the role of ${newRole}?`;

    if (!confirm(confirmText)) return;

    setUpdatingUserId(userId);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      setSuccessMsg(data.message);
      // Refresh user list
      await loadUsers();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update user role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-sm">
            <Crown className="h-3 w-3 text-amber-600" /> Super Admin
          </span>
        );
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 border border-red-200 text-bihari-terracotta text-xs font-bold">
            <ShieldCheck className="h-3 w-3" /> Operations Admin
          </span>
        );
      case "STAFF":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold">
            Staff Member
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
            Customer
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-bihari-terracotta">
          Super Admin Delegation
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-bihari-dark">
          Team & Role Access Control
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          As a Master Super Admin, you can assign or revoke administrative privileges for team members and customers.
        </p>
      </div>

      {/* Role Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-bihari-dark">Master Super Admin</h3>
              <p className="text-[10px] text-neutral-400">Highest Authority</p>
            </div>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Full root privileges: manages store settings, assigns/revokes team roles, oversees all inventory, orders, and UPI reconciliations.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-100 text-bihari-terracotta">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-bihari-dark">Operations Admin</h3>
              <p className="text-[10px] text-neutral-400">Daily Operations</p>
            </div>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Manages delicacies catalogue, pack pricing, stock inventory, and audits UPI payments. Cannot edit or escalate user roles.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-neutral-100 text-neutral-700">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-bihari-dark">Customer</h3>
              <p className="text-[10px] text-neutral-400">Shopper Access</p>
            </div>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Standard customer account with shopping cart and order history. Strictly blocked from entering the Admin panel.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200/60 p-4 text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200/60 p-4 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {successMsg}
        </div>
      )}

      {/* User Directory Table Card */}
      <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/10 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-bihari-dark">User & Staff Directory</h3>
            <p className="text-xs text-neutral-500">
              Total registered users: {users.length}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search user by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl text-xs border-amber-900/20"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            <div className="h-8 w-8 animate-spin border-4 border-bihari-terracotta border-t-transparent rounded-full mx-auto mb-2" />
            Loading user directory...
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/50 text-neutral-600 uppercase font-bold text-[10px] tracking-wider border-b border-amber-900/10">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Registered On</th>
                  <th className="p-3">Orders</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3 text-right">Assign / Revoke Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10">
                {filteredUsers.map((user) => {
                  const isUpdating = updatingUserId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-amber-100 text-bihari-dark font-bold flex items-center justify-center shrink-0 text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-800">{user.name}</p>
                            <p className="text-[10px] text-neutral-400 font-mono">{user.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <p className="font-medium text-neutral-700">{user.email}</p>
                        <p className="text-[11px] text-neutral-500">{user.phone || "No phone"}</p>
                      </td>

                      <td className="p-3 text-neutral-600">{formatDate(user.createdAt)}</td>

                      <td className="p-3 font-semibold text-neutral-800">
                        {user.orderCount} orders
                      </td>

                      <td className="p-3">{getRoleBadge(user.role)}</td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            disabled={isUpdating}
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value, user.name)}
                            className="text-xs font-bold rounded-lg border border-amber-900/20 bg-white px-2.5 py-1 text-bihari-dark focus:outline-none focus:ring-2 focus:ring-bihari-terracotta cursor-pointer disabled:opacity-50"
                          >
                            <option value="SUPER_ADMIN">👑 Super Admin</option>
                            <option value="ADMIN">🛡️ Operations Admin</option>
                            <option value="CUSTOMER">👤 Customer (Revoke)</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-neutral-400">
            No users found matching &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
