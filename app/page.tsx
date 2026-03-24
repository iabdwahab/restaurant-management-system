import ProductCard from "@/components/ProductCard";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from("menu_items").select("*");

  console.log(data);

  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
