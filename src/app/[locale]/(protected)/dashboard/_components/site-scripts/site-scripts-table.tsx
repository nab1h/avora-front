"use client";

import { useMemo, useState } from "react";
import { Edit3, MoreHorizontal, PackageOpen, RefreshCw, Search, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type SiteScript,
  useDeleteSiteScriptMutation,
  useGetSiteScriptsQuery,
  useUpdateSiteScriptMutation,
} from "@/lib/services/site-scripts-api";
import SiteScriptDialog from "./site-script-dialog";

interface SiteScriptsTableProps {
  onCreate: () => void;
}

export default function SiteScriptsTable({ onCreate }: SiteScriptsTableProps) {
  const t = useTranslations("siteScripts.table");
  const { data, isLoading, isError, refetch } = useGetSiteScriptsQuery();
  const [deleteSiteScript, { isLoading: isDeleting }] = useDeleteSiteScriptMutation();
  const [updateSiteScript, { isLoading: isToggling }] = useUpdateSiteScriptMutation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [scriptToDelete, setScriptToDelete] = useState<SiteScript | null>(null);
  const [scriptToEdit, setScriptToEdit] = useState<SiteScript | null>(null);

  const scripts = data ?? [];

  const filteredScripts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return scripts;
    }

    return scripts.filter((script) => {
      const searchableText = [
        script.name,
        t(`types.${script.type}`),
        t(`placements.${script.placement}`),
        t(`strategies.${script.strategy}`),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [scripts, search, t]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredScripts.length / pageSize));
  const paginatedScripts = filteredScripts.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const handleToggle = async (script: SiteScript) => {
    try {
      await updateSiteScript({
        id: script.id,
        data: {
          name: script.name,
          type: script.type,
          url: script.url ?? null,
          code: script.code ?? null,
          placement: script.placement,
          strategy: script.strategy,
          is_active: !script.is_active,
          sort_order: script.sort_order,
        },
      }).unwrap();

      toast.success(script.is_active ? t("messages.disabled") : t("messages.enabled"));
    } catch {
      toast.error(t("messages.updateFailed"));
    }
  };

  const handleDelete = async () => {
    if (!scriptToDelete) {
      return;
    }

    try {
      await deleteSiteScript(scriptToDelete.id).unwrap();
      toast.success(t("messages.deleted"));
      setScriptToDelete(null);
    } catch {
      toast.error(t("messages.deleteFailed"));
    }
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder={t("search")}
                className="ps-9"
              />
            </div>

            <Button variant="outline" onClick={onCreate}>
              {t("add")}
            </Button>
          </div>

          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">{t("columns.name")}</TableHead>
                  <TableHead className="text-start">{t("columns.type")}</TableHead>
                  <TableHead className="text-start">{t("columns.placement")}</TableHead>
                  <TableHead className="text-start">{t("columns.loading")}</TableHead>
                  <TableHead className="text-start">{t("columns.status")}</TableHead>
                  <TableHead className="text-start">{t("columns.sort")}</TableHead>
                  <TableHead className="text-end">{t("columns.actions")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                      <TableCell className="text-end"><Skeleton className="ms-auto h-8 w-8 rounded-md" /></TableCell>
                    </TableRow>
                  ))}

                {!isLoading && isError && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <p>{t("messages.loadFailed")}</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                          <RefreshCw className="size-4" />
                          {t("tryAgain")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && filteredScripts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-44 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <PackageOpen className="size-8" />
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{t("empty.title")}</p>
                          <p className="text-sm">{t("empty.description")}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={onCreate}>
                          {t("empty.addFirst")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && paginatedScripts.map((script) => (
                  <TableRow key={script.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{script.name}</span>
                        {script.url ? (
                          <span className="max-w-[260px] truncate text-xs text-muted-foreground">{script.url}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">{t("inlineCode")}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{t(`types.${script.type}`)}</TableCell>
                    <TableCell>{t(`placements.${script.placement}`)}</TableCell>
                    <TableCell>{t(`strategies.${script.strategy}`)}</TableCell>
                    <TableCell>
                      <Badge variant={script.is_active ? "default" : "secondary"} className={script.is_active ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"}>
                        {script.is_active ? t("status.active") : t("status.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell>{script.sort_order}</TableCell>
                    <TableCell className="text-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="size-8" aria-label={t("actions.forScript", { name: script.name })}>
                              <MoreHorizontal className="size-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setScriptToEdit(script)}>
                            <Edit3 className="me-2 size-4" /> {t("actions.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggle(script)} disabled={isToggling}>
                            <Zap className="me-2 size-4" /> {script.is_active ? t("actions.disable") : t("actions.enable")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setScriptToDelete(script)} className="text-destructive focus:text-destructive">
                            <Trash2 className="me-2 size-4" /> {t("actions.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {!isLoading && !isError && filteredScripts.length > 0 && (
            <div className="flex items-center justify-between gap-3 pt-2">
              <p className="text-sm text-muted-foreground">
                {t("pagination.page", { page, totalPages })}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                  {t("pagination.previous")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                  {t("pagination.next")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {scriptToEdit && (
        <SiteScriptDialog
          open={Boolean(scriptToEdit)}
          onOpenChange={(open) => {
            if (!open) {
              setScriptToEdit(null);
            }
          }}
          mode="edit"
          script={scriptToEdit}
        />
      )}

      <AlertDialog open={Boolean(scriptToDelete)} onOpenChange={(open) => {
        if (!open && !isDeleting) {
          setScriptToDelete(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete.description", { name: scriptToDelete?.name ?? t("delete.thisScript") })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("delete.cancel")}</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? t("delete.deleting") : t("delete.confirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}