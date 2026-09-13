"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import {
  useDeleteRoleMutation,
} from "@/lib/services/roles-api";

interface Props {
  id: number;
  name: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function DeleteRoleDialog({
  id,
  name,
  open,
  setOpen,
}: Props) {
  const t = useTranslations("roles");

  const [
    deleteRole,
    {
      isLoading,
    },
  ] = useDeleteRoleMutation();

  async function handleDelete() {
    try {
      await deleteRole(id).unwrap();

      setOpen(false);

      toast.success(
        t("delete.deletedSuccessfully")
      );
    } catch {
      toast.error(
        t("delete.failedToDelete")
      );
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("delete.title")}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {t("delete.description")}{" "}
            <span className="font-semibold">
              {name}
            </span>{" "}
            {t("delete.descriptionEnd")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("delete.cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("delete.deleting")}
              </>
            ) : (
              t("delete.delete")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
