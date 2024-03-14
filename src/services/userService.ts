import axiosInstance from "./axios";

export enum USER_ROLE {
    USER = 'user',
    ADMIN = 'admin',
}

export interface IUser {
    id: number;
    name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    phone: string;
    role: USER_ROLE;
    avatar?: string;
}

export const getAllUsers = async (token: string | null) => {
    if (!token) throw new Error('Не передан токен авторизации')
    const res = await axiosInstance<IUser[]>('/user', {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    return res.data
}

export const getUserById = async (token: string | null, id?: string) => {
    if (!token || !id) {
        throw new Error("Не передан токен или идентификатор пользователя")
    }
    const res = await axiosInstance<IUser>('/user/' + id, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    return res.data
}

export const updateUserById = async (id: number | string, token: string, newData: IUser) => {
    const res = await axiosInstance.put<IUser>('/user/' + id, newData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    return res.data
}

export const createUser = async (token: string, data: IUser) => {
    const res = await axiosInstance.post<IUser>('/user', data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })
    return res.data
}