import React, {FC, PropsWithChildren} from "react";
import {ICategory} from "../services/categoryService";
import {Divider, Form, Input, Typography} from "antd";
import TextArea from "antd/es/input/TextArea";

interface ICategoryForm extends PropsWithChildren {
    onFinish: (values: ICategory) => void;
    defaultValues?: ICategory;
}

const CategoryForm: FC<ICategoryForm> = ({
                                             onFinish,
                                             defaultValues,
                                             children,
                                         }) => {
    return (
      <Form layout="vertical" onFinish={onFinish}>
        <Divider />
        <Typography.Title level={3}>Заголовки</Typography.Title>
        <Form.Item
          label="Навание Eng"
          name="name"
          initialValue={defaultValues?.name}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Навание Ru"
          name="label"
          initialValue={defaultValues?.label}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Заголовок на странице"
          name="title"
          initialValue={defaultValues?.title}
          required
        >
          <Input />
        </Form.Item>
        <Divider />
        <Typography.Title level={3}>Описание</Typography.Title>
        <Form.Item
          label="Описание"
          name="description"
          initialValue={defaultValues?.description}
          required
        >
          <TextArea rows={5} />
        </Form.Item>
        <Divider />
        <Typography.Title level={3}>SEO блок</Typography.Title>
        <Form.Item
          label="SEO title для страницы"
          name="html_title"
          initialValue={defaultValues?.html_title}
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="SEO description для страницы"
          name="html_description"
          initialValue={defaultValues?.html_description}
          required
        >
          <TextArea rows={5} />
        </Form.Item>
        <Form.Item>{children}</Form.Item>
      </Form>
    );
};

export default CategoryForm;
