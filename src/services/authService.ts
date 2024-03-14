import axiosInstance from "./axios";
import {IUser} from "./userService";


interface IUserData {
    token: string;
    user: IUser;
}

export interface IChangePassword {
    name: string;
    oldPassword: string;
    newPassword: string;
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

export const changeUserPassword = async (token: string, passData: IChangePassword) => {
    const res = await axiosInstance.put<IUser>("/auth/password", passData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return res.data;
};