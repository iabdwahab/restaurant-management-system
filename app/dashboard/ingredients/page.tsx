import { createClient } from "@/utils/supabase/server";
import IngredientCard from "@/components/dashboard/IngredientCard";
import AddIngredientButton from "@/components/dashboard/AddIngredientButton";

export default async function IngredientsPage() {
  const supabase = await createClient();

  // Fetch ingredients from Supabase
  const { data: ingredients, error } = await supabase
    .from("ingredients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المكونات ({ingredients?.length})</h1>
        <AddIngredientButton />
      </div>

      {error ? (
        <div className="p-4 text-red-500 bg-red-100 rounded-lg text-right">
          حدث خطأ أثناء جلب البيانات: {error.message}
        </div>
      ) : ingredients?.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card border-dashed">
          لا توجد مكونات حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients?.map((ingredient) => (
            <IngredientCard key={ingredient.id} ingredient={ingredient} />
          ))}
        </div>
      )}
    </div>
  );
}
