import React from "react";
import { Navigate } from "react-router-dom";
import {
  ICategory,
  getCategoryById,
  updateCategoryById,
} from "../services/categoryService";
import Loader from "./loader";
import { Button, Spin } from "antd";
import CategoryForm from "./categoryForm";
import { useFormSubmit } from "../hooks/useFormSubmit";

const EditCategoryPage = () => {
  const {
    onFinish,
    loading,
    error,
    isSending,
    defaultValues: category,
  } = useFormSubmit<ICategory>({
    updateFn: updateCategoryById,
    getDefault: getCategoryById,
  });

  if (loading) return <Loader />;
  if (error || !category) return <Navigate to="/category" />;

  return (
    <CategoryForm defaultValues={category} onFinish={onFinish}>
      <Button htmlType="submit" type="primary" disabled={isSending}>
        {isSending ? <Spin size="small" /> : "Сохранить"}
      </Button>
    </CategoryForm>
  );
};

export default EditCategoryPage;
