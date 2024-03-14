import React from "react";

import {Button, Spin} from "antd";
import {useFormSubmit} from "../hooks/useFormSubmit";
import UserForm from "./userForm";
import {createUser, IUser} from "../services/userService";

const CreateCategoryPage = () => {
    const {onFinish, isSending} = useFormSubmit<IUser>({
        createFn: createUser,
    });

    return (
        <UserForm onFinish={onFinish}>
            <Button htmlType="submit" type="primary" disabled={isSending}>
                {isSending ? <Spin size="small"/> : "Сохранить"}
            </Button>
        </UserForm>
    );
};

export default CreateCategoryPage;
