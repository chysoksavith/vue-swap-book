export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    profile_image?: string;
    created_at: Date;
    updated_at: Date;
}