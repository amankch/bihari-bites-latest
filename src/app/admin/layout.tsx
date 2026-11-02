import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-[#FDFBF7]">
      <AdminNav />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</div>
    </div>
  );
}
