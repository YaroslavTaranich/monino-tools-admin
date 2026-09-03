import React, {useContext, useState} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {useFetch} from "./useFetch";
import {NotificationContext} from "../context/notificationContext";
import {isAxiosError} from "axios";

type updateFnType<T> = (
    id: string | number,
    data: T
) => Promise<T>;

type createFnType<T> = (data: T) => Promise<T>;

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
    const {setNotification} = useContext(NotificationContext);
    const navigate = useNavigate();
    const [isSending, setIsSending] = useState(false);

    const onFinish = async (values: T) => {
        setIsSending(true);
        try {
                if (createFn) {
                    const newData = await createFn(values);
                    navigate(`/${getBackLink(pathname)}/${newData.id}`)
                }
                if (updateFn && id) {
                    await updateFn(id, values);
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
                console.error(error);
                if (isAxiosError(error)) {
                    setNotification({
                        type: "error",
                        description: error.response?.data.message,
                    });
                }
        } finally {
            setIsSending(false);
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
