"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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

import { useDeleteUserMutation } from "@/lib/services/users-api";

interface Props {
  user: {
    id: number;
    name: string;
  };

  open: boolean;

  setOpen: (value: boolean) => void;
}

export default function DeleteUserDialog({
  user,
  open,
  setOpen,
}: Props) {
  const t = useTranslations("users");

  const [
    deleteUser,
    {
      isLoading,
    },
  ] = useDeleteUserMutation();

  async function handleDelete() {
    try {
      await deleteUser(user.id).unwrap();

      setOpen(false);

      toast.success(
        t("deleteUser.deletedSuccessfully")
      );
    } catch {
      toast.error(
        t("deleteUser.failedToDelete")
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
            {t("deleteUser.title")}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {t("deleteUser.description")}{" "}
            <span className="font-semibold">
              {user.name}
            </span>{" "}
            {t("deleteUser.descriptionEnd")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
          >
            {t("deleteUser.cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("deleteUser.deleting")}
              </>
            ) : (
              t("deleteUser.delete")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
