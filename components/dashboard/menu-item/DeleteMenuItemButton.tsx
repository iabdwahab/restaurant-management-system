"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteMenuItemButtonProps {
  id: string;
  name?: string;
}

export default function DeleteMenuItemButton({
  id,
  name,
}: DeleteMenuItemButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setIsDeleting(true);

    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    setIsDeleting(false);

    if (error) {
      console.error("Error deleting item:", error);
      toast.error("حدث خطأ أثناء الحذف");
      return;
    }

    toast.success("تم الحذف بنجاح");
    // Refresh the current route to fetch the updated list
    router.refresh();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex-1 gap-2 "
          size="sm"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? "جاري الحذف..." : "حذف"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا الإجراء لا يمكن التراجع عنه. سيتم حذف عنصر القائمة{" "}
            {name ? `"${name}"` : ""} نهائياً من قاعدة البيانات.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse sm:justify-start gap-2">
          <AlertDialogAction onClick={handleDelete} variant="destructive">
            تأكيد الحذف
          </AlertDialogAction>
          <AlertDialogCancel className="mt-0">إلغاء</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
