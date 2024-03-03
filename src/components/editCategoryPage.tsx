import React, { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ICategory,
  getCategoryById,
  updateCategoryById,
} from "../services/categoryService";
import { useFetch } from "../hooks/useFetch";
import Loader from "./loader";
import { Button, Spin } from "antd";
import { AuthContext } from "../context/authContext";
import { isAxiosError } from "axios";
import CategoryForm from "./categoryForm";
import { NotificationContext } from "../context/notificationContext";

const EditCategoryPage = () => {
  const { id } = useParams();
  const { error, loading, data: category } = useFetch(getCategoryById(id));
  const { token } = useContext(AuthContext);
  const { setNotification } = useContext(NotificationContext);
  const [isSending, setIsSending] = useState(false);

  if (loading) return <Loader />;
  if (error || !category || !id || !token) return <Navigate to="/category" />;

  const onFinish = async (values: ICategory) => {
    setIsSending(true);
    try {
      await updateCategoryById(id, token, values);
      setNotification({
        type: "success",
        message: "Данные обновлены!",
        decription: <Link to="/category">К списку категорий</Link>,
      });
    } catch (error) {
      console.log(error);
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
    <CategoryForm defaultValues={category} onFinish={onFinish}>
      <Button htmlType="submit" type="primary" disabled={isSending}>
        {isSending ? <Spin size="small" /> : "Сохранить"}
      </Button>
    </CategoryForm>
  );
};

export default EditCategoryPage;
