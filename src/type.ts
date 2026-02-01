import type { Request } from "express"

export interface UserRequest {
    firstName: string,
    lastName: string,
    email: string,
    password: string
    role: string
    tenantId?: number;
}

export interface RegisterUser extends Request {
    body: UserRequest
}

export interface LoginRequest {
    email: string,
    password: string
}
export interface Loginuser extends Request {
    body: LoginRequest
}
export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
        tenant: string;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface IRefreshTokenPayload {
    id: string
}


export interface ITenant {
    name: string,
    address: string
}

export interface CreateTenantRequest extends Request {
    body: ITenant;
}

export interface CreateUserRequest extends Request {
    body: UserRequest
}



export interface LimitedUserData {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    tenantId: number;
}

export interface UpdateUserRequest extends Request {
    body: LimitedUserData;
}

export interface UserQueryParams {
    perPage: number;
    currentPage: number;
    q: string;
    role: string;
}

export interface TenantQueryParams {
    q: string;
    perPage: number;
    currentPage: number;
}