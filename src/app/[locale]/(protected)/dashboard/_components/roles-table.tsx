"use client";

import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";

import { useGetRolesQuery } from "@/lib/services/roles-api";

import RoleActions from "./role-actions";

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions: Permission[];
}

export default function RolesTable() {
  const t = useTranslations("roles");

  const { data, isLoading } = useGetRolesQuery();

  const roles: Role[] = data?.data ?? [];

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">
                {t("table.id")}
              </TableHead>

              <TableHead className="text-start">
                {t("table.roleName")}
              </TableHead>

              <TableHead className="text-start">
                {t("table.permissions")}
              </TableHead>

              <TableHead className="text-start">
                {t("table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-10" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-60" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="ml-auto h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading &&
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    {role.id}
                  </TableCell>

                  <TableCell className="font-medium">
                    {role.name}
                  </TableCell>

                  <TableCell>
                    {role.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <Badge
                            key={permission.id}
                            variant="secondary"
                          >
                            {permission.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        {t("table.noPermissions")}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <RoleActions role={role} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}