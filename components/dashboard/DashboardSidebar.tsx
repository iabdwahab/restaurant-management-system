"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Utensils,
  Package,
  Settings,
  Menu,
  X,
  LayoutDashboard,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
  { name: "الأصناف", href: "/dashboard/items", icon: Utensils },
  { name: "المكونات", href: "/dashboard/ingredients", icon: Package },
  { name: "أقسام الأصناف", href: "/dashboard/categories", icon: LayoutGrid },
  { name: "إعدادات الموقع", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div
        className="md:hidden p-4 bg-background border-b flex justify-between items-center"
        dir="rtl"
      >
        <h1 className="font-bold text-xl">إدارة المطعم</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-background border-l transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
        dir="rtl"
      >
        <div className="h-full flex flex-col">
          <div className="p-6 hidden md:block border-b">
            <h1 className="text-2xl font-bold">إدارة المطعم</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
