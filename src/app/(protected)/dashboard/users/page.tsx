"use client";


import { useState } from "react";



import {
    useGetUsersQuery
} from "@/lib/services/users-api";
import UsersFilters from "../_components/users/users-filters";

import UsersPagination from "../_components/users/users-pagination";
import UsersTable from "../_components/users/users-table";
import AddUserButton from "../_components/users/add-user-button";



export default function UsersPage() {


    const [search, setSearch] = useState("");

    const [role, setRole] = useState("all");

    const [sort, setSort] = useState("-created_at");

    const [page, setPage] = useState(1);




    const {
        data,
        isLoading
    } = useGetUsersQuery({

        search: search || undefined,

        role: role === "all" ? undefined : role,

        sort,

        page,

        per_page: 10

    });





    return (

        <div className="space-y-6 p-6">


            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>

                <h1 className="text-3xl font-medium">
                    Users
                </h1>


                <p className="text-muted-foreground">
                    Manage users and access controls.
                </p>


                </div>
                <AddUserButton />
            </div>




            <UsersFilters

                search={search}

                setSearch={(value) => {

                    setPage(1);

                    setSearch(value);

                }}

                role={role}

                setRole={(value) => {

                    setPage(1);

                    setRole(value);

                }}

                sort={sort}

                setSort={(value) => {

                    setPage(1);

                    setSort(value);

                }}

            />





            <UsersTable

                users={data?.data ?? []}

                isLoading={isLoading}

            />





            {
                data?.meta &&

                <UsersPagination

                    current={
                        data.meta.current_page
                    }

                    last={
                        data.meta.last_page
                    }

                    setPage={setPage}

                />

            }



        </div>

    );

}