import React, {createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState,} from "react";
import {getUserProfile, IUser} from "../services/authService";

interface IUserData {
    token: string | null;
    user: IUser | null;
}

interface IAuthContext {
    user: IUser | null;
    token: string | null;
    updateUser?: (data: IUserData) => void;
}

export const AuthContext = createContext<IAuthContext>({
    token: null,
    user: null,
});

const AuthContextProvider: FC<PropsWithChildren> = ({children}) => {
    const userRef = useRef<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getUserProfile(token)
                .then((user) => {
                    userRef.current = user;
                    setToken(token);
                })
                .catch((error) => {
                    localStorage.removeItem("token");
                    console.error("Token expired");
                });
        }
    }, []);

    const updateUser = useCallback((data: IUserData) => {
        userRef.current = data.user;
        setToken(data.token);
    }, []);

    const value = useMemo(
        () => ({user: userRef.current, token, updateUser}),
        [token, updateUser]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
