import axiosInstance from "./axios";
export interface IAdmin {
    id: number;
    name: string;
    role: "admin";
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}


export const authUser = async (name: string, password: string) => {
    const res = await axiosInstance.post<{user: IAdmin}>("/auth/login", {
        name,
        password,
    });

    return res.data.user;
};

export const getUserProfile = async () => {
    const res = await axiosInstance<IAdmin>("/auth/profile");
    return res.data;
};

export const changeUserPassword = async (passData: IChangePassword) => {
    await axiosInstance.put("/auth/password", {
        oldPassword: passData.oldPassword,
        newPassword: passData.newPassword,
    });
};

export const logoutUser = async () => {
    await axiosInstance.post("/auth/logout");
};
