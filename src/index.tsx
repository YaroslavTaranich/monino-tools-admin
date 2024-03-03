import React from "react";
import ReactDOM from "react-dom/client";
import "normalize.css";
import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./router";
import AuthContextProvider from "./context/authContext";
import NotificationContextProvider from "./context/notificationContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <NotificationContextProvider>
          <MyRoutes />
        </NotificationContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
