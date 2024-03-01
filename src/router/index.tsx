import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ToolsPage from "../components/toolsPage";
import CategoriesPage from "../components/categoriesPage";
import AuthPage from "../components/authPage";
import { IUser, getUserProfile } from "../services/authService";
import PageLayout from "../components/pageLayout";
import EditCategoryPage from "../components/editCategoryPage";

interface IUserData {
  token: string | null;
  user: IUser | null;
}

interface IAuthContext {
  userData: IUserData;
  updateUser?: (data: IUserData) => void;
}

export const AuthContext = createContext<IAuthContext>({
  userData: { token: null, user: null },
});

const MyRoutes = () => {
  const [userData, setUserData] = useState<IUserData>({
    token: null,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserProfile(token)
        .then((user) => {
          setUserData({ token, user });
        })
        .catch((error) => console.error("Token expired"));
    }
  }, []);

  const updateUser = (data: IUserData) => {
    setUserData(data);
  };

  const privateRotes = (
    <PageLayout>
      <Routes>
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/category">
          <Route index element={<CategoriesPage />} />
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

  return (
    <AuthContext.Provider value={{ userData, updateUser }}>
      {!!userData.token ? privateRotes : publicRoutes}
    </AuthContext.Provider>
  );
};

export default MyRoutes;
