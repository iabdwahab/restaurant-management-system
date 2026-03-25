import ProductCard from "@/components/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { UtensilsCrossed } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  const totalItems = data?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header Section */}
      <div className="mb-10 text-center md:text-right">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-primary flex items-center justify-center md:justify-start gap-3">
          <UtensilsCrossed className="w-8 h-8" />
          قائمة الطعام
        </h1>
        <p className="text-muted-foreground text-lg">
          استكشف أشهى الأطباق المتاحة للطلب الآن.
          {totalItems > 0 && (
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mr-3">
              متوفر {totalItems} {totalItems === 1 ? "صنف" : "أصناف"}
            </span>
          )}
        </p>
      </div>

      {/* Main Content */}
      {totalItems === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/30">
          <UtensilsCrossed className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold mb-2">لا توجد أصناف متاحة</h2>
          <p className="text-muted-foreground max-w-sm">
            عذراً، لا يوجد حالياً أي أصناف متاحة للطلب في قائمة الطعام. يرجى
            العودة لاحقاً.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
