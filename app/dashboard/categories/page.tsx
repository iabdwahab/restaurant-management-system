import { createClient } from "@/utils/supabase/server";
import CategoryCard from "@/components/dashboard/CategoryCard";
import AddCategoryButton from "@/components/dashboard/AddCategoryButton";

export default async function CategoriesPage() {
  const supabase = await createClient();

  // Fetch categories from Supabase
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          التصنيفات ({categories?.length || 0})
        </h1>
        <AddCategoryButton />
      </div>

      {error ? (
        <div className="p-4 text-red-500 bg-red-100 rounded-lg text-right">
          حدث خطأ أثناء جلب البيانات: {error.message}
        </div>
      ) : categories?.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card border-dashed">
          لا توجد تصنيفات حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
