"use client";

import { useAdminOrders } from "@/hooks/use-orders";
import { formatPrice } from "@/lib/utils";
import { Users, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminCustomersPage() {
  const { data: orders, isLoading } = useAdminOrders();

  // Aggregate customers by phone number
  const customersMap: Record<
    string,
    {
      name: string;
      phone: string;
      city: string;
      state: string;
      orderCount: number;
      totalSpent: number;
    }
  > = {};

  orders?.forEach((o) => {
    const key = o.address.phone;
    if (!customersMap[key]) {
      customersMap[key] = {
        name: o.address.fullName,
        phone: o.address.phone,
        city: o.address.city,
        state: o.address.state,
        orderCount: 0,
        totalSpent: 0,
      };
    }
    customersMap[key].orderCount += 1;
    if (o.payment?.status === "PAID") {
      customersMap[key].totalSpent += Number(o.finalAmount);
    }
  });

  const customerList = Object.values(customersMap);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-bihari-terracotta">
          Customer Relationship Management
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-bihari-dark">
          Customer Directory
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          View loyal Bihari Bites customers across India with total order volume.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            Loading customers...
          </div>
        ) : customerList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/50 text-neutral-600 uppercase font-bold text-[10px] tracking-wider border-b border-amber-900/10">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Mobile Number</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Total Orders</th>
                  <th className="p-3">Total Paid Spent</th>
                  <th className="p-3 text-right">WhatsApp Assist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10">
                {customerList.map((c) => (
                  <tr key={c.phone} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-3 font-semibold text-neutral-900">{c.name}</td>
                    <td className="p-3 font-mono text-neutral-700">{c.phone}</td>
                    <td className="p-3 text-neutral-600">
                      {c.city}, {c.state}
                    </td>
                    <td className="p-3 font-bold text-neutral-800">{c.orderCount} orders</td>
                    <td className="p-3 font-bold text-emerald-800">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={`https://wa.me/91${c.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Pranam ${c.name}! Thank you for being a valued patron of BIHARI BITES.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-lg text-xs font-bold border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-1"
                        >
                          <PhoneCall className="h-3 w-3" /> WhatsApp
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-neutral-500">
            No customers registered yet.
          </div>
        )}
      </div>
    </div>
  );
}
