import React, {useContext, useState} from "react";
import {Button, Form, Input, Spin} from "antd";
import {AuthContext} from "../context/authContext";
import {changeUserPassword, IChangePassword} from "../services/authService";
import {isAxiosError} from "axios";
import Title from "antd/es/typography/Title";
import {NotificationContext} from "../context/notificationContext";


const UserForm = () => {
    const {logout} = useContext(AuthContext)
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState("")
    const {setNotification} = useContext(NotificationContext);


    const onFinish = async (values: IChangePassword) => {
        try {
            setIsSending(true)
            await changeUserPassword(values)
            setNotification({
                type: "success",
                message: "Пароль изменён. Войдите снова."
            })
            await logout()
        } catch (error) {
            if (isAxiosError(error)) {
                setError(error.message)
                setNotification({
                    type: "error",
                    message: error.response?.data.message || "Произошла ошибка! Попробуйте ещё раз!"
                })
            }
        } finally {
            setIsSending(false)
        }
    }


    const onChange = () => {
        if (error) setError("")
    }

    return (
        <Form layout="vertical" onFinish={onFinish} onChange={onChange} style={{marginTop: 16}}>
            <Title>Смена пароля</Title>
            <Form.Item
                label="Старый пароль"
                name="oldPassword"
                rules={[{required: true, message: "Введите текущий пароль"}]}
            >
                <Input.Password autoComplete="current-password"/>
            </Form.Item>
            <Form.Item
                label="Новый пароль"
                name="newPassword"
                rules={[
                    {required: true, message: "Введите новый пароль"},
                    {min: 10, message: "Минимум 10 символов"},
                ]}
            >
                <Input.Password autoComplete="new-password"/>
            </Form.Item>
            <Form.Item
                label="Повторите новый пароль"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                    {required: true, message: "Повторите новый пароль"},
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            return !value || getFieldValue("newPassword") === value
                                ? Promise.resolve()
                                : Promise.reject(new Error("Пароли не совпадают"));
                        },
                    }),
                ]}
            >
                <Input.Password autoComplete="new-password"/>
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary" disabled={isSending}>
                    {isSending ? <Spin size="small"/> : "Изменить пароль"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UserForm;
