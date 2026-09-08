import React, { FC, PropsWithChildren, useMemo } from "react";
import { Alert, Divider, Form, Input, Select, Switch, Typography } from "antd";
import { getTools, ITool } from "../services/toolsService";
import RelatedToolsSelect from "./relatedToolsSelect";
import TextArea from "antd/es/input/TextArea";
import { useFetch } from "../hooks/useFetch";
import { getAllCategoriesNames } from "../services/categoryService";
import {getToolTypes} from "../services/toolTypesService";

interface IToolFormProps extends PropsWithChildren {
  onFinish: (values: ITool) => void;
  defaultValues?: ITool;
}

const ToolForm: FC<IToolFormProps> = ({
  children,
  onFinish,
  defaultValues,
}) => {
  const [form] = Form.useForm();
  const accessoryOnly = Form.useWatch("accessory_only", form) ?? defaultValues?.accessory_only ?? false;
  const toolsRequest = useMemo(() => getTools(), []);
  const {data: tools, loading: toolsLoading, error: toolsError} = useFetch(toolsRequest);
  const categoriesRequest = useMemo(() => getAllCategoriesNames(), []);
  const typesRequest = useMemo(() => getToolTypes(), []);
  const { data: names, loading, error } = useFetch(categoriesRequest);
  const {
    data: toolTypes,
    loading: toolTypesLoading,
    error: toolTypesError,
  } = useFetch(typesRequest);

  const options = names?.map((name) => ({ value: name.id, label: name.label }));
  const toolTypeOptions = toolTypes
    ?.filter((toolType) => toolType.is_active || toolType.id === defaultValues?.tool_type_id)
    .map((toolType) => ({
      value: toolType.id,
      label: toolType.is_active ? toolType.name : `${toolType.name} (скрыт)`,
      disabled: !toolType.is_active && toolType.id !== defaultValues?.tool_type_id,
    }));

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Divider />
      <Typography.Title level={3}>Заголовки</Typography.Title>
      <Form.Item
        label="Навание Eng (в адресной строке)"
        name="name"
        initialValue={defaultValues?.name}
        required
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Навание Ru (заголовок в категориях)"
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
      <Typography.Title level={3}>Описания и характеристики</Typography.Title>
      <Form.Item
        label="Описание"
        name="description"
        initialValue={defaultValues?.description}
        required
      >
        <TextArea rows={5} />
      </Form.Item>
      <Form.Item
        label="Технические характеристики (название:значение)"
        name="specification"
        initialValue={defaultValues?.specification}
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
      <Divider />
      <Typography.Title level={3}>Цены </Typography.Title>

      <Form.Item
        label="Цена за 1 день"
        name="price"
        initialValue={defaultValues?.price}
        required
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="Залог за 1 день"
        name="zalog"
        initialValue={defaultValues?.zalog}
        required
      >
        <Input type="number" />
      </Form.Item>

      <Divider />
      <Typography.Title level={3}>Дополнительно </Typography.Title>

      <Form.Item label="Только с основным инструментом" name="accessory_only"
        initialValue={defaultValues?.accessory_only ?? false} valuePropName="checked"
        extra="Дополнение оплачивается отдельно по своей цене и тарифам за срок аренды.">
        <Switch />
      </Form.Item>
      {toolsError && <Alert type="error" message="Не удалось загрузить совместимые позиции. Обновите страницу, чтобы редактировать связи." />}
      <Form.Item label={accessoryOnly ? "Совместимые основные инструменты" : "Сопутствующие дополнения"}
        name="related_tool_ids" initialValue={defaultValues?.related_tool_ids ?? []}
        dependencies={["accessory_only"]}
        extra="Связь добавляется и удаляется с обеих сторон. Порядок показа задаётся отдельно для этой карточки. При смене назначения удалите несовместимые связи."
        rules={[{validator: async (_, ids: number[] = []) => {
          if (tools && ids.some(id => {
            const target = tools.find(tool => tool.id === id);
            return !target || !!target.accessory_only === !!form.getFieldValue("accessory_only");
          })) throw new Error("Удалите несовместимые связи перед сохранением");
        }}]}>
        <RelatedToolsSelect tools={(tools ?? []).filter(tool => tool.id !== defaultValues?.id)}
          accessoryOnly={!!accessoryOnly} disabled={toolsLoading || !!toolsError} />
      </Form.Item>
      <Form.Item
        label="Тип инструмента"
        name="tool_type_id"
        initialValue={defaultValues?.tool_type_id}
        rules={[{required: true, message: "Выберите тип инструмента"}]}
      >
        <Select
          disabled={toolTypesLoading || !!toolTypesError}
          loading={toolTypesLoading}
          options={toolTypeOptions}
          placeholder="Выберите тип"
        />
      </Form.Item>
      <Form.Item
        label="Категория инструмента"
        name="categoryId"
        initialValue={defaultValues?.categoryId}
        required
      >
        <Select disabled={loading || !!error} options={options} />
      </Form.Item>
      <Form.Item
        label="Популярный"
        name="popular"
        initialValue={defaultValues?.popular}
        valuePropName="checked"
        required
      >
        <Switch />
      </Form.Item>
      <Form.Item>{children}</Form.Item>
    </Form>
  );
};

export default ToolForm;
