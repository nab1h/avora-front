"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

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

import {
    useDeleteSocialLinkMutation,
    useGetSocialLinksQuery,
    type SocialLink,
} from "@/lib/services/social-links";

import SocialPlatformIcon from "@/components/social-platform-icon";

interface Props {
    onEdit: (socialLink: SocialLink) => void;
}

export default function SocialLinksTable({
    onEdit,
}: Props) {
    const t = useTranslations("socialLinks.table");

    const {
        data: socialLinks,
        isLoading,
    } = useGetSocialLinksQuery();

    const [
        deleteSocialLink,
        { isLoading: isDeleting },
    ] = useDeleteSocialLinkMutation();

    const [selectedLink, setSelectedLink] =
        useState<SocialLink | null>(null);

    const handleDelete = async () => {
        if (!selectedLink) return;

        try {
            await deleteSocialLink(
                selectedLink.id
            ).unwrap();

            toast.success(
                t("messages.deleted")
            );

            setSelectedLink(null);
        } catch (error: any) {
            console.error(
                "Delete social link error:",
                error
            );

            toast.error(
                error?.data?.message ||
                    error?.data?.error ||
                    t("messages.deleteFailed")
            );
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>

                <CardContent className="space-y-3">
                    {Array.from({
                        length: 5,
                    }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-12 w-full"
                        />
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {t("title")}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {socialLinks?.length ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {t("platform")}
                                        </TableHead>

                                        <TableHead>
                                            {t("url")}
                                        </TableHead>

                                        <TableHead>
                                            {t("status")}
                                        </TableHead>

                                        <TableHead>
                                            {t("sortOrder")}
                                        </TableHead>

                                        <TableHead className="text-end">
                                            {t("actions")}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {socialLinks.map(
                                        (socialLink) => (
                                            <TableRow
                                                key={
                                                    socialLink.id
                                                }
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 items-center justify-center rounded-md border bg-muted">
                                                            <SocialPlatformIcon
                                                                icon={
                                                                    socialLink
                                                                        .platform
                                                                        .icon
                                                                }
                                                                className="size-5"
                                                            />
                                                        </div>

                                                        <span className="font-medium">
                                                            {
                                                                socialLink
                                                                    .platform
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <a
                                                        href={
                                                            socialLink.url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block max-w-sm truncate text-sm text-muted-foreground hover:text-foreground"
                                                    >
                                                        {
                                                            socialLink.url
                                                        }
                                                    </a>
                                                </TableCell>

                                                <TableCell>
                                                    <span
                                                        className={
                                                            socialLink.is_active
                                                                ? "font-medium text-green-600"
                                                                : "text-muted-foreground"
                                                        }
                                                    >
                                                        {socialLink.is_active
                                                            ? t(
                                                                  "active"
                                                              )
                                                            : t(
                                                                  "inactive"
                                                              )}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        socialLink.sort_order
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() =>
                                                                onEdit(
                                                                    socialLink
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            onClick={() =>
                                                                setSelectedLink(
                                                                    socialLink
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-sm text-muted-foreground">
                            {t("empty")}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog
                open={Boolean(selectedLink)}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedLink(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t("delete.title")}
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {t("delete.description")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isDeleting}
                        >
                            {t("delete.cancel")}
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting
                                ? t("delete.deleting")
                                : t("delete.confirm")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}