"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Database } from "@/types/supabase";

type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

interface EditMenuItemButtonProps {
  item: MenuItem;
}

export default function EditMenuItemButton({ item }: EditMenuItemButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const image_url = (formData.get("imageUrl") as string) || null;
    const is_available = formData.get("isAvailable") === "on";

    const { error } = await supabase
      .from("menu_items")
      .update({
        name,
        description,
        price,
        image_url,
        is_available,
      })
      .eq("id", item.id);

    setIsSaving(false);

    if (error) {
      console.error("Error updating item:", error);
      toast.error("حدث خطأ أثناء التعديل");
      return;
    }

    toast.success("تم التعديل بنجاح");
    setIsOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 gap-2 bg-transparent"
          size="sm"
        >
          <Edit className="w-4 h-4" />
          تعديل
        </Button>
      </DialogTrigger>

      <DialogContent dir="rtl" className="sm:max-w-[500px]">
        <form onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle>تعديل الصنف</DialogTitle>
            <DialogDescription>
              قم بتعديل بيانات الصنف من هنا. اضغط على حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right whitespace-nowrap">
                الاسم
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={item.name}
                className="col-span-3"
                required
              />
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
                defaultValue={item.description || ""}
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
                defaultValue={item.price}
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
                defaultValue={item.image_url || ""}
                className="col-span-3"
                dir="ltr"
              />
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
                  defaultChecked={item.is_available ?? true}
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
              {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
