import React, {createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo, useState,} from "react";
import {authUser, getUserProfile, IAdmin, logoutUser} from "../services/authService";
import {setUnauthorizedHandler} from "../services/axios";

interface IAuthContext {
    user: IAdmin | null;
    isLoading: boolean;
    login: (name: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
    user: null,
    isLoading: true,
    login: async () => undefined,
    logout: async () => undefined,
});

const AuthContextProvider: FC<PropsWithChildren> = ({children}) => {
    const [user, setUser] = useState<IAdmin | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setUnauthorizedHandler(() => setUser(null));
        getUserProfile()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
        return () => setUnauthorizedHandler();
    }, []);

    const login = useCallback(async (name: string, password: string) => {
        const admin = await authUser(name, password);
        setUser(admin);
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    }, []);

    const value = useMemo(
        () => ({user, isLoading, login, logout}),
        [user, isLoading, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
