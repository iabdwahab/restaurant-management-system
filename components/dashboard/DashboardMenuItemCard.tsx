import { Edit } from "lucide-react";
import { Database } from "@/types/supabase";
import DeleteMenuItemButton from "./DeleteMenuItemButton";
import EditMenuItemButton from "./EditMenuItemButton";

type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

interface DashboardMenuItemCardProps {
  item: MenuItem;
}

export default function DashboardMenuItemCard({
  item,
}: DashboardMenuItemCardProps) {
  return (
    <div
      className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md h-full"
      dir="rtl"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={item.image_url || "https://placehold.net/default.png"}
          alt={item.name}
          className="object-cover w-full h-full"
        />

        <div
          className={`absolute top-2 right-2 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
            item.is_available
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {item.is_available ? "متاح" : "غير متاح"}
        </div>
      </div>

      <div className="flex flex-col p-4 flex-1">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="font-semibold text-lg line-clamp-1 flex-1">
            {item.name}
          </h3>
          <span className="font-bold text-primary whitespace-nowrap">
            {item.price.toFixed(2)}$
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {item.description || "لا يوجد وصف"}
        </p>

        <div className="flex gap-2 pt-4 mt-auto border-t">
          <EditMenuItemButton item={item} />
          <DeleteMenuItemButton id={item.id} name={item.name} />
        </div>
      </div>
    </div>
  );
}
