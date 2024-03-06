import React, { ReactElement, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ToolsTable from "../components/toolsTable";
import CategoriesPage from "../components/categoriesPage";
import AuthPage from "../components/authPage";
import PageLayout from "../components/pageLayout";
import EditCategoryPage from "../components/editCategoryPage";
import CreateCategoryPage from "../components/createCategoryPage";
import { AuthContext } from "../context/authContext";
import { ArgsProps } from "antd/es/notification";
import EditToolPage from "../components/editToolPage";
import CreateToolPage from "../components/createToolPage";

export interface INotificationData {
  type: "success" | "error";
  message?: string | ReactElement;
  decription?: string | ReactElement;
  placament?: ArgsProps["placement"];
}

const MyRoutes = () => {
  const { token } = useContext(AuthContext);

  const privateRotes = (
    <PageLayout>
      <Routes>
        <Route path="/tools">
          <Route index element={<ToolsTable />} />
          <Route path=":id" element={<EditToolPage />} />
          <Route path="create" element={<CreateToolPage />} />
        </Route>
        <Route path="/category">
          <Route index element={<CategoriesPage />} />
          <Route path="create" element={<CreateCategoryPage />} />
          <Route path=":id" element={<EditCategoryPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/tools" />} />
      </Routes>
    </PageLayout>
  );

  const publicRoutes = (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

  return !!token ? privateRotes : publicRoutes;
};

export default MyRoutes;
