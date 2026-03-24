import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col md:flex-row min-h-screen text-foreground bg-background"
      dir="rtl"
    >
      <DashboardSidebar />
      <main className="flex-1 w-full overflow-y-auto p-4 md:p-8 bg-muted/20">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
