import React from "react";
import ToolForm from "./toolForm";
import { Button, Spin } from "antd";
import Loader from "./loader";
import { Navigate } from "react-router-dom";
import { ITool, getToolById, updateToolById } from "../services/toolsService";
import { useFormSubmit } from "../hooks/useFormSubmit";

const EditToolPage = () => {
  const {
    onFinish,
    loading,
    error,
    isSending,
    defaultValues: tool,
  } = useFormSubmit<ITool>({
    updateFn: updateToolById,
    getDefault: getToolById,
  });

  if (loading) return <Loader />;
  if (error || !tool) return <Navigate to="/category" />;

  return (
    <ToolForm onFinish={onFinish} defaultValues={tool}>
      <Button htmlType="submit" type="primary" disabled={isSending}>
        {isSending ? <Spin size="small" /> : "Сохранить"}
      </Button>
    </ToolForm>
  );
};

export default EditToolPage;
