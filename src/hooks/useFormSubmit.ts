import React, {useContext, useState} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useFetch} from "./useFetch";
import {AuthContext} from "../context/authContext";
import {NotificationContext} from "../context/notificationContext";
import {isAxiosError} from "axios";

type updateFnType<T> = (
    id: string | number,
    token: string,
    data: T
) => Promise<T>;

type createFnType<T> = (token: string, data: T) => Promise<T>;

type GetDefaultValuesType<T> = (id?: string | number) => Promise<T>;

const getBackLink = (path: string) => {
    const splited = path.split("/");
    return splited[splited.length - 2];
};

interface IOptions<T> {
    updateFn?: updateFnType<T>;
    createFn?: createFnType<T>;
    getDefault?: GetDefaultValuesType<T>;
    successMessageText?: string;
}

export const useFormSubmit = <T extends { id: number }>(options: IOptions<T>) => {
    const {updateFn, createFn, getDefault, successMessageText} = options;

    const {id} = useParams();
    const {pathname} = useLocation();
    const {
        error,
        loading,
        data: defaultValues,
    } = useFetch(getDefault ? getDefault(id) : undefined);
    const {token} = useContext(AuthContext);
    const {setNotification} = useContext(NotificationContext);
    const navigate = useNavigate();
    const [isSending, setIsSending] = useState(false);

    const onFinish = async (values: T) => {
        console.log(values);
        setIsSending(true);
        if (token) {
            try {
                if (createFn) {
                    const newData = await createFn(token, values);
                    navigate(`/${getBackLink(pathname)}/${newData.id}`)
                }
                if (updateFn && id) {
                    await updateFn(id, token, values);
                }
                const link = React.createElement(Link, {
                    to: `/${getBackLink(pathname)}`,
                    children: successMessageText || "Вернуться назад",
                });
                setNotification({
                    type: "success",
                    message: "Сохранено!",
                    description: link,
                });
            } catch (error) {
                console.log(error);
                if (isAxiosError(error)) {
                    setNotification({
                        type: "error",
                        description: error.response?.data.message,
                    });
                }
            } finally {
                setIsSending(false);
            }
        }
    };

    return {
        onFinish,
        error,
        loading,
        isSending,
        defaultValues,
    };
};
