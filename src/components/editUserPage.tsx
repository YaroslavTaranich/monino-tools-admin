import React, {useContext} from 'react';
import {useFormSubmit} from "../hooks/useFormSubmit";
import {getUserById, IUser, updateUserById} from "../services/userService";
import {Button, Spin} from "antd";
import UserForm from "./userForm";
import {AuthContext} from "../context/authContext";
import {useFetch} from "../hooks/useFetch";
import {Navigate, useParams} from "react-router-dom";
import Loader from "./loader";
import UserChangePasswordForm from "./userChangePasswordForm";

const EditUserPage = () => {
    const {
        onFinish,
        isSending,
    } = useFormSubmit<IUser>({
        updateFn: updateUserById,
    });

    const {id} = useParams()
    const {token, user} = useContext(AuthContext)
    const {loading, data: defaultValues} = useFetch(getUserById(token, id))

    if (loading) {
        return <Loader/>
    }
    if (!defaultValues) {
        return <Navigate to={'/user/'}/>

    }

    return (
        <>
            <UserForm defaultValues={defaultValues} onFinish={onFinish}>
                <Button htmlType="submit" type="primary" disabled={isSending}>
                    {isSending ? <Spin size="small"/> : "Сохранить"}
                </Button>
            </UserForm>
            {user?.id === Number(id) && <UserChangePasswordForm/>}
        </>
    );
};

export default EditUserPage;