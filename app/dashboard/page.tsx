import DashboardMenuItemCard from "@/components/dashboard/menu-item/DashboardMenuItemCard";
import AddMenuItemButton from "@/components/dashboard/menu-item/AddMenuItemButton";
import { createClient } from "@/utils/supabase/server";

export default async function ItemsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("menu_items").select("*");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الأصناف ({data?.length || 0})</h1>
        <AddMenuItemButton />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((item) => (
          <DashboardMenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
