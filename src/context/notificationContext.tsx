import { notification } from "antd";
import { ArgsProps } from "antd/es/notification";
import React, {
  FC,
  PropsWithChildren,
  ReactElement,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

interface INotificationData {
  type: "success" | "error";
  message?: string | ReactElement;
  decription?: string | ReactElement;
  placament?: ArgsProps["placement"];
}

interface INotificationContext {
  setNotification: (data: INotificationData) => void;
}

export const NotificationContext = createContext<INotificationContext>({
  setNotification: () => {},
});

const NotificationContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();
  const [notificationData, setNotificationData] =
    useState<INotificationData | null>(null);

  useEffect(() => {
    console.log(notificationData);
    if (notificationData?.type === "success") {
      console.log("allo");
      api.success({
        message: notificationData.message,
        description: notificationData.decription,
        placement: notificationData.placament || "topLeft",
      });
    }
    if (notificationData?.type === "error") {
      console.log("allo");

      api.error({
        message: notificationData.message || "Ошибка!",
        description: notificationData.decription,
        placement: notificationData.placament || "topLeft",
      });
    }
  }, [notificationData, api]);

  const setNotification = useCallback((data: INotificationData) => {
    setNotificationData(data);
  }, []);

  return (
    <NotificationContext.Provider value={{ setNotification }}>
      <div>{contextHolder}</div>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
