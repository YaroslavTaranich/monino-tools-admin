import axiosInstance from "./axios";

export enum USER_ROLE {
    USER = "user",
    ADMIN = "admin",
}

export interface IUser {
    name: string;
    first_name?: string;
    last_name?: string;
    password: string;
    email?: string;
    phone?: string;
    role?: USER_ROLE;
    avatar?: string;
}

interface IUserData {
    token: string;
    user: IUser;
}

export const authUser = async (name: string, password: string) => {
    const res = await axiosInstance.post<IUserData>("/auth/admin", {
        name,
        password,
    });

    return res.data;
};

export const getUserProfile = async (token: string) => {
    const res = await axiosInstance<IUser>("/auth/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return res.data;
};
