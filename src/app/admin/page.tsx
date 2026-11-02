"use client";

import Link from "next/link";
import { TrendingUp, ShoppingBag, Clock, Package, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { useAdminStats } from "@/hooks/use-orders";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-bold text-bihari-dark">Admin Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-white border border-amber-900/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats?.totalRevenue || 0),
      subtitle: "Verified UPI Payments",
      icon: TrendingUp,
      color: "text-emerald-700 bg-emerald-100",
    },
    {
      label: "Total Orders",
      value: String(stats?.totalOrders || 0),
      subtitle: "Lifetime Placed Orders",
      icon: ShoppingBag,
      color: "text-bihari-terracotta bg-red-100",
    },
    {
      label: "Pending UPI Approvals",
      value: String(stats?.pendingUpiOrders || 0),
      subtitle: "Action Required (Check Bank)",
      icon: Clock,
      color: "text-amber-700 bg-amber-100",
    },
    {
      label: "Active Products",
      value: String(stats?.activeProducts || 0),
      subtitle: "Thekua, Sattu, Aachar, Ghee",
      icon: Package,
      color: "text-blue-700 bg-blue-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-bihari-terracotta">
            Management Console
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-bihari-dark">
            Store Performance & Reconciliation
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Reconcile direct UPI payments, review shipments, and update inventory.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/orders?status=PENDING_PAYMENT">
            <Button className="rounded-xl font-bold gap-1.5 shadow-md">
              <Clock className="h-4 w-4" /> Review Pending UPIs ({stats?.pendingUpiOrders || 0})
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button variant="outline" className="rounded-xl border-amber-900/20 font-bold">
              + New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {stat.label}
                </p>
                <p className="font-serif text-2xl sm:text-3xl font-extrabold text-bihari-dark mt-1">
                  {stat.value}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{stat.subtitle}</p>
              </div>
              <div className={`rounded-2xl p-3.5 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-bihari-dark">Recent Customer Orders</h3>
            <p className="text-xs text-neutral-500">Latest orders placed via Storefront</p>
          </div>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="text-xs font-bold gap-1">
              View All Orders <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/50 text-neutral-600 uppercase font-bold text-[10px] tracking-wider border-b border-amber-900/10">
                <tr>
                  <th className="p-3">Order No.</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">UPI Status</th>
                  <th className="p-3">UTR Reference</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10">
                {stats.recentOrders.map((order) => {
                  const isPaid = order.payment?.status === "PAID";
                  const hasUtr = Boolean(order.payment?.upiTxnRef);

                  return (
                    <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-bihari-dark">
                        {order.orderNumber}
                      </td>
                      <td className="p-3 font-semibold text-neutral-800">
                        {order.address.fullName}
                      </td>
                      <td className="p-3 text-neutral-600">{order.address.phone}</td>
                      <td className="p-3 font-bold text-bihari-dark">
                        {formatPrice(order.finalAmount)}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={isPaid ? "success" : hasUtr ? "warning" : "destructive"}
                          className="text-[10px]"
                        >
                          {isPaid ? "PAID" : hasUtr ? "UTR SUBMITTED" : "PENDING"}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono font-semibold text-neutral-800">
                        {order.payment?.upiTxnRef || (
                          <span className="text-neutral-400 italic">None</span>
                        )}
                      </td>
                      <td className="p-3 text-neutral-500">{formatDate(order.createdAt)}</td>
                      <td className="p-3 text-right">
                        <Link href={`/admin/orders`}>
                          <Button size="sm" variant="outline" className="text-[11px] h-7 px-2.5">
                            Audit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 text-xs">
            No orders placed yet. Products are ready for customers!
          </div>
        )}
      </div>
    </div>
  );
}
