"use client";


import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";



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



    return (

        <div className="flex flex-col gap-4 md:flex-row">


            <Input

                placeholder="Search by name or email..."

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

                    <SelectValue placeholder="Filter role" />

                </SelectTrigger>



                <SelectContent>


                    <SelectItem value="all">
                        All Roles
                    </SelectItem>


                    <SelectItem value="admin">
                        Admin
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
                        Oldest
                    </SelectItem>


                    <SelectItem value="-created_at">
                        Newest
                    </SelectItem>


                    <SelectItem value="name">
                        Name A-Z
                    </SelectItem>


                    <SelectItem value="-name">
                        Name Z-A
                    </SelectItem>



                </SelectContent>


            </Select>


        </div>

    );

}