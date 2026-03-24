"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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

export default function AddIngredientButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const is_available = formData.get("isAvailable") === "on";

    const { error } = await supabase.from("ingredients").insert({
      name,
      description,
      is_available,
    });

    setIsSaving(false);

    if (error) {
      console.error("Error adding ingredient:", error);
      toast.error("حدث خطأ أثناء إضافة المكون");
      return;
    }

    toast.success("تم الإضافة بنجاح");
    setIsOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-5 h-5" />
          إضافة مكون جديد
        </Button>
      </DialogTrigger>

      <DialogContent dir="rtl" className="sm:max-w-[425px]">
        <form onSubmit={handleAdd}>
          <DialogHeader>
            <DialogTitle>إضافة مكون جديد</DialogTitle>
            <DialogDescription>
              قم بتعبئة بيانات المكون الجديد هنا. اضغط على حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-right">
                الاسم
              </Label>
              <Input id="name" name="name" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-right">
                الوصف
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label
                htmlFor="isAvailable"
                className="text-right whitespace-nowrap col-span-1"
              >
                متاح
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
              {isSaving ? "جاري الحفظ..." : "حفظ المكون"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
