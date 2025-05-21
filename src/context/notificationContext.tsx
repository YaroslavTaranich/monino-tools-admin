import {notification} from "antd";
import {ArgsProps} from "antd/es/notification";
import React, {createContext, FC, PropsWithChildren, ReactElement, useCallback, useEffect, useState,} from "react";

interface INotificationData {
    type: "success" | "error";
    message?: string | ReactElement;
    description?: string | ReactElement;
    placement?: ArgsProps["placement"];
}

interface INotificationContext {
    setNotification: (data: INotificationData) => void;
}

export const NotificationContext = createContext<INotificationContext>({
    setNotification: () => {
    },
});

const NotificationContextProvider: FC<PropsWithChildren> = ({children}) => {
    const [api, contextHolder] = notification.useNotification();
    const [notificationData, setNotificationData] =
        useState<INotificationData | null>(null);

    useEffect(() => {
        if (notificationData?.type === "success") {
            api.success({
                message: notificationData.message,
                description: notificationData.description,
                placement: notificationData.placement || "topLeft",
            });
        }
        if (notificationData?.type === "error") {
            api.error({
                message: notificationData.message || "Ошибка!",
                description: notificationData.description,
                placement: notificationData.placement || "topLeft",
            });
        }
    }, [notificationData, api]);

    const setNotification = useCallback((data: INotificationData) => {
        setNotificationData(data);
    }, []);

    return (
        <NotificationContext.Provider value={{setNotification}}>
            <div>{contextHolder}</div>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContextProvider;
