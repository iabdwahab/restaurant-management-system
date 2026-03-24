import { Database } from "@/types/supabase";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

interface ProductCardProps {
  item: MenuItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  return (
    <div
      className="group flex flex-col rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 h-full"
      dir="rtl"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={item.image_url || "https://placehold.net/600x400"}
          alt={item.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />

        {/* Optional overlay gradient for better edge contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex flex-col p-5 flex-1">
        <div className="flex justify-between items-start mb-3 gap-4">
          <h3 className="font-bold text-xl line-clamp-1 flex-1 leading-tight">
            {item.name}
          </h3>
          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold whitespace-nowrap">
            {item.price.toFixed(2)}$
          </div>
        </div>

        <p className="text-muted-foreground line-clamp-2 mb-6 flex-1 text-sm leading-relaxed">
          {item.description || "لا يوجد وصف متوفر لهذا الصنف حالياً."}
        </p>

        <div className="mt-auto pt-4 border-t border-border/50">
          <Button
            className="w-full gap-2 font-semibold hover:scale-[1.02] transition-transform"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            اطلب الآن
          </Button>
        </div>
      </div>
    </div>
  );
}
