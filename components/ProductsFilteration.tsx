"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import ProductCard from "@/components/ProductCard";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { Database } from "@/types/supabase";

type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function ProductsFilteration() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [catsRes, itemsRes] = await Promise.all([
        supabase
          .from("categories")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase
          .from("menu_items")
          .select("*")
          .eq("is_available", true)
          .order("created_at", { ascending: false }),
      ]);

      if (catsRes.data) setCategories(catsRes.data);
      if (itemsRes.data) setAllItems(itemsRes.data);

      setIsLoading(false);
    };

    fetchData();
  }, [supabase]);

  const displayedItems = useMemo(() => {
    if (selectedCategoryId) {
      return allItems.filter((item) => item.category_id === selectedCategoryId);
    }
    return allItems;
  }, [allItems, selectedCategoryId]);

  const getCategoryCount = (categoryId: string | null) => {
    if (categoryId === null) return allItems.length;
    return allItems.filter((item) => item.category_id === categoryId).length;
  };

  return (
    <div className="flex flex-col space-y-8" dir="rtl">
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center md:justify-start gap-3">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out ${
            selectedCategoryId === null
              ? "bg-primary text-primary-foreground shadow-md scale-105"
              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
          }`}
        >
          <span>الجميع</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              selectedCategoryId === null
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary"
            }`}
          >
            {getCategoryCount(null)}
          </span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out ${
              selectedCategoryId === category.id
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <span>{category.name}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                selectedCategoryId === category.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {getCategoryCount(category.id)}
            </span>
          </button>
        ))}
      </div>

      {/* Filtered Items Content */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-primary/20 animate-pulse"></div>
              <Loader2 className="w-12 h-12 animate-spin text-primary relative z-10" />
            </div>
            <p className="text-muted-foreground font-medium animate-pulse">
              جاري تحميل الأطباق...
            </p>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/20">
            <UtensilsCrossed className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">لا توجد أصناف متاحة</h2>
            <p className="text-muted-foreground max-w-sm">
              عذراً، لم نتمكن من العثور على أي أصناف متاحة في هذا التصنيف
              حالياً.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
