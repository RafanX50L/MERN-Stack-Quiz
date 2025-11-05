import { Request } from "express";

export interface IAdminUserService {
    placeholder?: never

    getUsers(query: any): Promise<{
        users: any[];
        pagination: { page: number; limit: number; total: number };
    }>;

    toggleBlockUser(id: string, isBlocked: boolean): Promise<{
        message: string;
        user: any;
    }>;

    bulkToggleBlock(ids: string[], isBlocked: boolean): Promise<{
        message: string;
    }>;
}