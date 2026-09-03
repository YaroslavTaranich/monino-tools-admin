import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

let unauthorizedHandler: (() => void) | undefined;

export const setUnauthorizedHandler = (handler?: () => void) => {
    unauthorizedHandler = handler;
};

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && error.config?.url !== "/auth/login") {
            unauthorizedHandler?.();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
