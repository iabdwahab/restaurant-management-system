import ProductsFilteration from "@/components/ProductsFilteration";
import { UtensilsCrossed } from "lucide-react";

export default function Home() {
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
        </p>
      </div>

      {/* Main Content */}
      <ProductsFilteration />
    </div>
  );
}
