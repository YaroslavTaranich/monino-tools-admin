import React, {useContext, useState} from "react";
import {Button, Form, Input, Spin} from "antd";
import {AuthContext} from "../context/authContext";
import {changeUserPassword, IChangePassword} from "../services/authService";
import {isAxiosError} from "axios";
import Title from "antd/es/typography/Title";
import {NotificationContext} from "../context/notificationContext";


const UserForm = () => {
    const {token, user} = useContext(AuthContext)
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState("")
    const {setNotification} = useContext(NotificationContext);


    const onFinish = async (values: IChangePassword) => {
        try {
            setIsSending(true)
            if (token) {
                await changeUserPassword(token, values)
                setNotification({
                    type: "success",
                    message: "Пароль успешно изменён!"
                })
            }
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
                label="Имя пользователя"
                name="name"
                initialValue={user?.name}
                required
                style={{display: 'none'}}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Старый пароль"
                name="oldPassword"
                required
            >
                <Input type="password"/>
            </Form.Item>
            <Form.Item
                label="Новый пароль"
                name="newPassword"
                required
            >
                <Input type="password"/>
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
