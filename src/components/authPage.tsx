import { Button, Form, Input, Space } from "antd";
import React, { useContext, useState } from "react";
import { authUser } from "../services/authService";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

type FieldType = {
  name: string;
  password: string;
};

const AuthPage = () => {
  const [error, setError] = useState("");
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values: FieldType) => {
    try {
      const userData = await authUser(values.name, values.password);
      updateUser!(userData);
      navigate("/tools");
      localStorage.setItem("token", userData.token);
    } catch (e) {
      setError("Неверное имя пользователя или пароль");
    }
  };

  return (
    <div
      style={{
        minWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form
        name="basic"
        style={{ maxWidth: 600, minWidth: 400 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        //   onFinishFailed={onFinishFailed}
        autoComplete="off"
        onFieldsChange={() => setError("")}
      >
        <Form.Item<FieldType>
          label="Имя пользователя"
          name="name"
          rules={[{ required: true, message: "Введите имя пользователя!" }]}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Войти
          </Button>
        </Form.Item>
        <Space
          style={{
            width: "100%",
            textAlign: "center",
            color: "red",
          }}
        >
          {error}
        </Space>
      </Form>
    </div>
  );
};

export default AuthPage;
