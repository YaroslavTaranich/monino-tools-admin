import React, { useContext, useState } from "react";
import CategoryForm from "./categoryForm";
import { ICategory, createCategory } from "../services/categoryService";
import { AuthContext } from "../context/authContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { Button, Spin } from "antd";
import { NotificationContext } from "../context/notificationContext";

const CreateCategoryPage = () => {
  const { setNotification } = useContext(NotificationContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  if (!token) {
    return <Navigate to="/category" />;
  }

  const onFinish = async (data: ICategory) => {
    setIsSending(true);
    try {
      const result = await createCategory(token, data);
      setNotification({
        type: "success",
        message: `Категория ${data.label} создана`,
        decription: <Link to="/category">К списку категорий</Link>,
      });
      navigate("/category/" + result.id);
    } catch (error) {
      if (isAxiosError(error)) {
        setNotification({
          type: "error",
          decription: error.response?.data.message,
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <CategoryForm onFinish={onFinish}>
      <Button htmlType="submit" type="primary" disabled={isSending}>
        {isSending ? <Spin size="small" /> : "Сохранить"}
      </Button>
    </CategoryForm>
  );
};

export default CreateCategoryPage;
