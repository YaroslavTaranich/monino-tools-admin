import React, {FC, PropsWithChildren} from "react";
import {Form, Input, Select} from "antd";
import {IUser, USER_ROLE} from "../services/userService";

interface IToolFormProps extends PropsWithChildren {
    onFinish: (values: IUser) => void;
    defaultValues?: IUser;
}

const UserForm: FC<IToolFormProps> = ({
                                          children,
                                          onFinish,
                                          defaultValues,
                                      }) => {

    const options = [{value: USER_ROLE.USER, label: "Пользователь"}, {value: USER_ROLE.ADMIN, label: "Администратор"}]

    return (
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Имя пользователя"
                name="name"
                initialValue={defaultValues?.name}
                required
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Имя"
                name="first_name"
                initialValue={defaultValues?.first_name}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Фамилия"
                name="last_name"
                initialValue={defaultValues?.last_name}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Почта"
                name="email"
                initialValue={defaultValues?.email}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Номер телефона"
                name="phone"
                initialValue={defaultValues?.phone}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Роль"
                name="role"
                initialValue={defaultValues?.role}
                required
            >
                <Select options={options}/>
            </Form.Item>
            <Form.Item>{children}</Form.Item>
        </Form>
    );
};

export default UserForm;
