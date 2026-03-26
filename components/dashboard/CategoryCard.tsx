"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, LayoutGrid } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
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

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface CategoryCardProps {
  category: Category;
}

// --- Edit Component ---
function EditCategoryButton({ category }: { category: Category }) {
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
      .from("categories")
      .update({
        name,
        description,
      })
      .eq("id", category.id);

    setIsSaving(false);

    if (error) {
      console.error("Error updating category:", error);
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
        <Button variant="outline" className="flex-1 gap-2" size="sm">
          <Edit className="w-4 h-4" />
          تعديل
        </Button>
      </DialogTrigger>

      <DialogContent dir="rtl" className="sm:max-w-[425px]">
        <form onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle>تعديل التصنيف</DialogTitle>
            <DialogDescription>
              قم بتعديل بيانات التصنيف من هنا. اضغط على حفظ عند الانتهاء.
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
                defaultValue={category.name}
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
                defaultValue={category.description || ""}
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
function DeleteCategoryButton({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setIsDeleting(true);

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    setIsDeleting(false);

    if (error) {
      console.error("Error deleting category:", error);
      toast.error("حدث خطأ أثناء الحذف");
      return;
    }

    toast.success("تم الحذف بنجاح");
    setIsOpen(false);
    router.refresh();
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
            هذا الإجراء لا يمكن التراجع عنه. سيقوم بحذف التصنيف "{category.name}" بشكل نهائي.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse sm:justify-start gap-2 mt-4">
          <AlertDialogCancel className="mt-0" disabled={isDeleting}>إلغاء</AlertDialogCancel>
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

// --- Main Card Component ---
export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div
      className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md p-4 h-full"
      dir="rtl"
    >
      <div className="flex items-start justify-between gap-4 mb-4 flex-1">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t mt-auto">
        <EditCategoryButton category={category} />
        <DeleteCategoryButton category={category} />
      </div>
    </div>
  );
}