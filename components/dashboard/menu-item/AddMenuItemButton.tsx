"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddMenuItemButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Data states
  const [ingredients, setIngredients] = useState<
    { id: string; name: string; is_available: boolean }[]
  >([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>(
    [],
  );
  const [newIngredientName, setNewIngredientName] = useState("");
  const [isCreatingIngredient, setIsCreatingIngredient] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const [ingRes, catRes] = await Promise.all([
          supabase
            .from("ingredients")
            .select("id, name, is_available")
            .order("created_at", { ascending: false }),
          supabase
            .from("categories")
            .select("id, name")
            .order("created_at", { ascending: false }),
        ]);

        if (!ingRes.error && ingRes.data) {
          setIngredients(ingRes.data);
        }
        if (!catRes.error && catRes.data) {
          setCategories(catRes.data);
        }
      };
      fetchData();

      // Reset state on open
      setSelectedIngredientIds([]);
      setNewIngredientName("");
    }
  }, [isOpen]);

  const handleCreateIngredient = async () => {
    if (!newIngredientName.trim()) return;

    setIsCreatingIngredient(true);
    const { data, error } = await supabase
      .from("ingredients")
      .insert({
        name: newIngredientName.trim(),
        is_available: true,
      })
      .select()
      .single();

    setIsCreatingIngredient(false);

    if (error) {
      toast.error("حدث خطأ أثناء إضافة المكون");
      return;
    }

    if (data) {
      toast.success("تم إضافة المكون الجديد");
      setIngredients((prev) => [data, ...prev]);
      setSelectedIngredientIds((prev) => [...prev, data.id]);
      setNewIngredientName("");
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const image_url = (formData.get("imageUrl") as string) || null;
    const category_id = (formData.get("category") as string) || null;
    const is_available = formData.get("isAvailable") === "on";

    // Insert menu item and get its ID
    const { data: itemData, error: itemError } = await supabase
      .from("menu_items")
      .insert({
        name,
        description,
        price,
        image_url,
        category_id,
        is_available,
      })
      .select()
      .single();

    if (itemError) {
      console.error("Error adding item:", itemError);
      toast.error("حدث خطأ أثناء إضافة الصنف");
      setIsSaving(false);
      return;
    }

    // Insert ingredients link
    if (itemData && selectedIngredientIds.length > 0) {
      const itemIngredients = selectedIngredientIds.map((ingredientId) => ({
        menu_item_id: itemData.id,
        ingredient_id: ingredientId,
      }));

      const { error: linkError } = await supabase
        .from("item_ingredients")
        .insert(itemIngredients);

      if (linkError) {
        console.error("Error linking ingredients:", linkError);
        toast.error("تم إضافة الصنف ولكن فشل ربط المكونات");
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(false);
    toast.success("تمت الإضافة بنجاح");
    setIsOpen(false);
    router.refresh();
  };

  const toggleIngredient = (id: string) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-5 h-5" />
          إضافة صنف جديد
        </Button>
      </DialogTrigger>

      <DialogContent
        dir="rtl"
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleAdd}>
          <DialogHeader>
            <DialogTitle>إضافة صنف جديد</DialogTitle>
            <DialogDescription>
              قم بتعبئة بيانات الصنف الجديد هنا، واختر المكونات.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right whitespace-nowrap">
                الاسم
              </Label>
              <Input id="name" name="name" className="col-span-3" required />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="category"
                className="text-right whitespace-nowrap"
              >
                التصنيف
              </Label>
              <select
                id="category"
                name="category"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">بدون تصنيف</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="description"
                className="text-right whitespace-nowrap"
              >
                الوصف
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right whitespace-nowrap">
                السعر ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="imageUrl"
                className="text-right whitespace-nowrap"
              >
                رابط الصورة
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                className="col-span-3"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4 mt-2 border-t pt-4">
              <Label className="text-right whitespace-nowrap pt-2">
                المكونات
              </Label>
              <div className="col-span-3 space-y-3">
                {/* Custom ingredients selection */}
                {ingredients.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto border rounded-md p-3 grid grid-cols-2 gap-2 bg-muted/20">
                    {ingredients.map((ing) => (
                      <label
                        key={ing.id}
                        className={`flex items-center gap-2 text-sm ${
                          ing.is_available
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 w-4 h-4 accent-primary"
                          checked={selectedIngredientIds.includes(ing.id)}
                          onChange={() => toggleIngredient(ing.id)}
                          disabled={!ing.is_available}
                        />
                        <span>
                          {ing.name}
                          {!ing.is_available && (
                            <span className="text-xs text-muted-foreground mr-1">
                              (غير متاح)
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    لا توجد مكونات سابقة. يمكنك إضافة مكون جديد.
                  </p>
                )}

                {/* Create new ingredient inline */}
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="اسم مكون جديد..."
                    value={newIngredientName}
                    onChange={(e) => setNewIngredientName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateIngredient();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCreateIngredient}
                    disabled={!newIngredientName.trim() || isCreatingIngredient}
                    className="shrink-0"
                  >
                    {isCreatingIngredient && (
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    )}
                    إضافة للقائمة
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label
                htmlFor="isAvailable"
                className="text-right whitespace-nowrap col-span-1"
              >
                متاح للطلب
              </Label>
              <div className="col-span-3 flex justify-start">
                <Switch
                  id="isAvailable"
                  name="isAvailable"
                  defaultChecked={true}
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "جاري الحفظ..." : "حفظ الصنف"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
