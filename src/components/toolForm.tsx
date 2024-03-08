import React, {FC, PropsWithChildren} from "react";
import {Form, Input, Select, Switch} from "antd";
import {ITool} from "../services/toolsService";
import TextArea from "antd/es/input/TextArea";
import {useFetch} from "../hooks/useFetch";
import {getAllCategoriesNames} from "../services/categoryService";

interface IToolFormProps extends PropsWithChildren {
    onFinish: (values: ITool) => void;
    defaultValues?: ITool;
}

const ToolForm: FC<IToolFormProps> = ({
                                          children,
                                          onFinish,
                                          defaultValues,
                                      }) => {
    const {data: names, loading, error} = useFetch(getAllCategoriesNames());

    const options = names?.map((name) => ({value: name.id, label: name.label}));

    return (
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Навание Eng"
                name="name"
                initialValue={defaultValues?.name}
                required
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Навание Ru"
                name="label"
                initialValue={defaultValues?.label}
                required
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Заголовок на странице"
                name="title"
                initialValue={defaultValues?.title}
                required
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="html title"
                name="html_title"
                initialValue={defaultValues?.html_title}
                required
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Описание"
                name="description"
                initialValue={defaultValues?.description}
                required
            >
                <TextArea rows={5}/>
            </Form.Item>
            <Form.Item
                label="Технические характеристики (название:значение)"
                name="specification"
                initialValue={defaultValues?.description}
                required
            >
                <TextArea rows={5}/>
            </Form.Item>
            <Form.Item
                label="Описание html"
                name="html_description"
                initialValue={defaultValues?.html_description}
                required
            >
                <TextArea rows={5}/>
            </Form.Item>
            <Form.Item
                label="Цена за 1 день"
                name="price"
                initialValue={defaultValues?.price}
                required
            >
                <Input type="number"/>
            </Form.Item>
            <Form.Item
                label="Залог за 1 день"
                name="zalog"
                initialValue={defaultValues?.zalog}
                required
            >
                <Input type="number"/>
            </Form.Item>
            <Form.Item
                label="Тип инструмента"
                name="tool_type"
                initialValue={defaultValues?.tool_type}
                required
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Категория инструмента"
                name="categoryId"
                initialValue={defaultValues?.categoryId}
                required
            >
                <Select disabled={loading || !!error} options={options}/>
            </Form.Item>
            <Form.Item
                label="Популярный"
                name="popular"
                initialValue={defaultValues?.popular}
                valuePropName="checked"
                required
            >
                <Switch/>
            </Form.Item>
            <Form.Item>{children}</Form.Item>
        </Form>
    );
};

export default ToolForm;
