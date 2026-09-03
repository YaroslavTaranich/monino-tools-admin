import React, {useContext} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import ToolsTable from "../components/toolsTable";
import CategoriesPage from "../components/categoriesPage";
import AuthPage from "../components/authPage";
import PageLayout from "../components/pageLayout";
import EditCategoryPage from "../components/editCategoryPage";
import CreateCategoryPage from "../components/createCategoryPage";
import {AuthContext} from "../context/authContext";
import EditToolPage from "../components/editToolPage";
import CreateToolPage from "../components/createToolPage";
import AccountPage from "../components/accountPage";
import Loader from "../components/loader";

const MyRoutes = () => {
    const {user, isLoading} = useContext(AuthContext);

    if (isLoading) return <Loader/>;

    const privateRotes = (
        <PageLayout>
            <Routes>
                <Route path="/tools">
                    <Route index element={<ToolsTable/>}/>
                    <Route path=":id" element={<EditToolPage/>}/>
                    <Route path="create" element={<CreateToolPage/>}/>
                </Route>
                <Route path="/category">
                    <Route index element={<CategoriesPage/>}/>
                    <Route path="create" element={<CreateCategoryPage/>}/>
                    <Route path=":id" element={<EditCategoryPage/>}/>
                </Route>
                <Route path="/account" element={<AccountPage/>}/>
                <Route path="*" element={<Navigate to="/category"/>}/>
            </Routes>
        </PageLayout>
    );

    const publicRoutes = (
        <Routes>
            <Route path="/" element={<AuthPage/>}/>
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    );

    return !!user ? privateRotes : publicRoutes;
};

export default MyRoutes;
