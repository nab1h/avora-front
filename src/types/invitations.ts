export interface InvitationRole {
    id: number;
    name: string;
}


export interface Invitation {
    id: number;
    email: string;
    token: string;
    role_id: number;
    invited_by: number;

    expires_at: string;
    accepted_at: string | null;
    revoked_at: string | null;

    created_at: string;
    updated_at: string;

    role: InvitationRole;

    inviter: {
        id: number;
        name: string;
        email: string;
    };
}