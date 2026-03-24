import DashboardMenuItemCard from "@/components/dashboard/DashboardMenuItemCard";
import { createClient } from "@/utils/supabase/server";

export default async function ItemsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("menu_items").select("*");

  console.log(data);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">الأصناف</h1>
      {/* TODO: Add Items Content */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((item) => (
          <DashboardMenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
