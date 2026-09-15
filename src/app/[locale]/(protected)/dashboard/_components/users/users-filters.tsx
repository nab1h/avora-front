"use client";


import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";



interface Props {

    search: string;

    setSearch: (value: string) => void;

    role: string;

    setRole: (value: string) => void;

    sort: string;

    setSort: (value: string) => void;

}

export default function UsersFilters({
    search,
    setSearch,
    role,
    setRole,
    sort,
    setSort
}: Props) {

const t = useTranslations('users')
    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <Input
                placeholder={t("Search")}
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                className="md:w-80"
            />

            <Select
                value={role}
                onValueChange={(value) => {
                    if (value) {
                        setRole(value);
                    }
                }}
            >
                <SelectTrigger className="md:w-48">
                    <SelectValue placeholder={t("filter.all")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        {t("filter.all")}
                    </SelectItem>
                    <SelectItem value="admin">
                        {t("filter.admin")}
                    </SelectItem>
                </SelectContent>
            </Select>



            <Select
                value={sort}
                onValueChange={(value) => {
                    if (value) {
                        setSort(value);
                    }
                }}
            >
                <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="created_at">
                        {t("filter.Oldest")}
                    </SelectItem>
                    <SelectItem value="-created_at">
                        {t("filter.Newest")}
                    </SelectItem>
                    <SelectItem value="name">
                        {t("filter.NaZ")}
                    </SelectItem>
                    <SelectItem value="-name">
                        {t("filter.NaA")}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

}