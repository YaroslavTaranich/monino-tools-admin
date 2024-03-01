import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { getCategoryById } from "../services/categoryService";
import { useFetch } from "../hooks/useFetch";
import Loader from "./loader";
import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";

const EditCategoryPage = () => {
  const { id } = useParams();
  const { error, loading, data: tool } = useFetch(getCategoryById(id));

  if (loading) return <Loader />;
  if (error || !tool) return <Navigate to="/category" />;

  return (
    <Form layout="vertical" onFinish={console.log}>
      <Form.Item label="Навание Eng" name="name" initialValue={tool.name}>
        <Input />
      </Form.Item>
      <Form.Item label="Навание Ru" name="label" initialValue={tool.label}>
        <Input />
      </Form.Item>
      <Form.Item
        label="html title"
        name="html_title"
        initialValue={tool.html_title}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Описание"
        name="description"
        initialValue={tool.description}
      >
        <TextArea rows={5} />
      </Form.Item>
      <Form.Item
        label="Описание html"
        name="html_description"
        initialValue={tool.html_description}
      >
        <TextArea rows={5} />
      </Form.Item>
      <Form.Item label="Картинка" name="image" initialValue={tool.image}>
        <Input />
      </Form.Item>
    </Form>
  );
};

export default EditCategoryPage;
