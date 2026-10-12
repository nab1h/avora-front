"use client";

import { useMemo, useState } from "react";
import { Edit3, MoreHorizontal, PackageOpen, RefreshCw, Search, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";

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

const normalizeType = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
const normalizePlacement = (value: string) => value.replace(/_/g, " ");

export default function SiteScriptsTable({ onCreate }: SiteScriptsTableProps) {
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
      const searchableText = [script.name, script.type, script.placement, script.strategy]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [scripts, search]);

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

      toast.success(`Script ${script.is_active ? "disabled" : "enabled"} successfully.`);
    } catch {
      toast.error("Failed to update script state. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!scriptToDelete) {
      return;
    }

    try {
      await deleteSiteScript(scriptToDelete.id).unwrap();
      toast.success("Script deleted successfully.");
      setScriptToDelete(null);
    } catch {
      toast.error("Failed to delete script. Please try again.");
    }
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search scripts"
                className="pl-9"
              />
            </div>

            <Button variant="outline" onClick={onCreate}>
              Add Script
            </Button>
          </div>

          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Loading</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sort</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-8 rounded-md" /></TableCell>
                    </TableRow>
                  ))}

                {!isLoading && isError && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <p>Scripts could not be loaded.</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                          <RefreshCw className="size-4" />
                          Try again
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
                          <p className="font-medium text-foreground">No scripts yet</p>
                          <p className="text-sm">Create your first website script to get started.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={onCreate}>
                          Add first script
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
                          <span className="text-xs text-muted-foreground">Inline code script</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{normalizeType(script.type)}</TableCell>
                    <TableCell>{normalizePlacement(script.placement)}</TableCell>
                    <TableCell>{script.strategy}</TableCell>
                    <TableCell>
                      <Badge variant={script.is_active ? "default" : "secondary"} className={script.is_active ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"}>
                        {script.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{script.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${script.name}`}>
                              <MoreHorizontal className="size-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setScriptToEdit(script)}>
                            <Edit3 className="mr-2 size-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggle(script)} disabled={isToggling}>
                            <Zap className="mr-2 size-4" /> {script.is_active ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setScriptToDelete(script)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 size-4" /> Delete
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
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                  Next
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
            <AlertDialogTitle>Delete script?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {scriptToDelete?.name ?? "this script"} from the public website. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
