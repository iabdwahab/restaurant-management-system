"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Package } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

type Ingredient = Database["public"]["Tables"]["ingredients"]["Row"];

interface IngredientCardProps {
  ingredient: Ingredient;
}

// --- Edit Component ---
function EditIngredientButton({ ingredient }: { ingredient: Ingredient }) {
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

    const { error } = await supabase
      .from("ingredients")
      .update({ name, description })
      .eq("id", ingredient.id);

    setIsSaving(false);

    if (!error) {
      setIsOpen(false);
      toast.success("تم التعديل بنجاح");
      router.refresh();
    } else {
      console.error("Error updating ingredient:", error);
      toast.error("حدث خطأ أثناء التعديل");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 gap-2" size="sm">
          <Edit className="w-4 h-4" />
          تعديل
        </Button>
      </DialogTrigger>

      <DialogContent dir="rtl" className="sm:max-w-[425px]">
        <form onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle>تعديل المكون</DialogTitle>
            <DialogDescription>
              تعديل تفاصيل المكون هنا. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-right">
                الاسم
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={ingredient.name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-right">
                الوصف
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={ingredient.description || ""}
                rows={3}
                className="resize-none"
              />
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

// --- Delete Component ---
function DeleteIngredientButton({ id, name }: { id: string; name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setIsDeleting(true);
    const { error } = await supabase.from("ingredients").delete().eq("id", id);
    setIsDeleting(false);

    if (!error) {
      setIsOpen(false);
      toast.success("تم الحذف بنجاح");
      router.refresh();
    } else {
      console.error("Error deleting ingredient:", error);
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex-1 gap-2" size="sm">
          <Trash2 className="w-4 h-4" />
          حذف
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المكون "{name}" نهائياً من
            قاعدة البيانات.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse sm:justify-start gap-2">
          <AlertDialogCancel className="mt-0">إلغاء</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// --- Main Component ---
export default function IngredientCard({ ingredient }: IngredientCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isUpdating, setIsUpdating] = useState(false);

  // States for toggle confirmation
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [pendingAvailability, setPendingAvailability] = useState(
    ingredient.is_available,
  );

  const handleToggleClick = (checked: boolean) => {
    setPendingAvailability(checked);
    setShowToggleModal(true);
  };

  const confirmToggle = async () => {
    setIsUpdating(true);

    const { error } = await supabase
      .from("ingredients")
      .update({ is_available: pendingAvailability })
      .eq("id", ingredient.id);

    setIsUpdating(false);
    setShowToggleModal(false);

    if (!error) {
      toast.success("تم تغيير الحالة بنجاح");
      router.refresh();
    } else {
      console.error("Error updating ingredient status:", error);
      toast.error("حدث خطأ أثناء تغيير الحالة");
    }
  };

  return (
    <div
      className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md p-4 h-full"
      dir="rtl"
    >
      <div className="flex items-start justify-between gap-4 mb-4 flex-1">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">
              {ingredient.name}
            </h3>
            {ingredient.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {ingredient.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              ingredient.is_available
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {ingredient.is_available ? "متاح" : "غير متاح"}
          </span>
          <Switch
            checked={ingredient.is_available}
            onCheckedChange={handleToggleClick}
            disabled={isUpdating}
            dir="rtl"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t mt-auto">
        <EditIngredientButton ingredient={ingredient} />
        <DeleteIngredientButton id={ingredient.id} name={ingredient.name} />
      </div>

      {/* Confirmation Modal for Availability Toggle */}
      <AlertDialog open={showToggleModal} onOpenChange={setShowToggleModal}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد تعديل الحالة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من تغيير حالة "{ingredient.name}" إلى{" "}
              {pendingAvailability ? "متاح" : "غير متاح"}؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse sm:justify-start gap-2">
            <AlertDialogCancel className="mt-0">إلغاء</AlertDialogCancel>
            <Button disabled={isUpdating} onClick={confirmToggle}>
              {isUpdating ? "جاري الحفظ..." : "تأكيد التغيير"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
