export interface Permission {
    id: number;
    name: string;
    guard_name: string;
}


export interface Role {
    id: number;
    name: string;
    guard_name: string;
}


export interface User {

    id: number;

    name: string;

    email: string;

    is_active: boolean;

    created_at: string;

    updated_at: string;

    roles: Role[];

    permissions: Permission[];

    avatar?: string | null;

}



export interface UsersResponse {

    data: User[];

    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };


    meta: {

        current_page: number;

        from: number | null;

        last_page: number;

        per_page: number;

        to: number | null;

        total: number;

        links: {
            url: string | null;
            label: string;
            page: number | null;
            active: boolean;
        }[];

    };

}