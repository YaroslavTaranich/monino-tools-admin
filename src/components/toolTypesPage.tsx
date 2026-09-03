import React, {useCallback, useEffect, useState} from "react";
import {
    Button,
    Flex,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Space,
    Switch,
    Table,
    Tag,
    Typography,
} from "antd";
import {ColumnsType} from "antd/es/table";
import {isAxiosError} from "axios";
import {
    createToolType,
    deleteToolType,
    getToolTypes,
    IToolType,
    ToolTypeInput,
    updateToolType,
} from "../services/toolTypesService";
import Loader from "./loader";

const ToolTypesPage = () => {
    const [form] = Form.useForm<ToolTypeInput>();
    const [toolTypes, setToolTypes] = useState<IToolType[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadToolTypes = useCallback(async () => {
        setLoading(true);
        try {
            setToolTypes(await getToolTypes());
            setError("");
        } catch (requestError) {
            setError("Не удалось загрузить типы инструментов");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadToolTypes();
    }, [loadToolTypes]);

    const startCreate = () => {
        setEditingId(null);
        form.setFieldsValue({
            slug: "",
            name: "",
            sort_order: toolTypes.length,
            is_active: true,
        });
    };

    const startEdit = (toolType: IToolType) => {
        setEditingId(toolType.id);
        form.setFieldsValue(toolType);
    };

    const save = async (values: ToolTypeInput) => {
        setSaving(true);
        setError("");
        try {
            if (editingId) {
                await updateToolType(editingId, values);
            } else {
                await createToolType(values);
            }
            form.resetFields();
            setEditingId(null);
            await loadToolTypes();
        } catch (requestError) {
            if (isAxiosError(requestError)) {
                setError(requestError.response?.data?.message || "Не удалось сохранить тип");
            } else {
                setError("Не удалось сохранить тип");
            }
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: number) => {
        setError("");
        try {
            await deleteToolType(id);
            await loadToolTypes();
        } catch (requestError) {
            if (isAxiosError(requestError)) {
                setError(requestError.response?.data?.message || "Не удалось удалить тип");
            } else {
                setError("Не удалось удалить тип");
            }
        }
    };

    const columns: ColumnsType<IToolType> = [
        {title: "Название", dataIndex: "name"},
        {title: "Slug", dataIndex: "slug"},
        {title: "Порядок", dataIndex: "sort_order", width: 110},
        {
            title: "Статус",
            dataIndex: "is_active",
            render: (isActive: boolean) => isActive
                ? <Tag color="green">Активен</Tag>
                : <Tag>Скрыт</Tag>,
        },
        {
            title: "Действия",
            render: (_, record) => (
                <Space>
                    <Button onClick={() => startEdit(record)}>Изменить</Button>
                    <Popconfirm
                        title="Удалить тип?"
                        description="Тип нельзя удалить, пока он назначен инструментам."
                        okText="Удалить"
                        cancelText="Отмена"
                        onConfirm={() => remove(record.id)}
                    >
                        <Button danger>Удалить</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (loading && toolTypes.length === 0) return <Loader/>;

    return (
        <Flex vertical gap={24}>
            <Flex justify="space-between" align="center">
                <Typography.Title level={2} style={{margin: 0}}>
                    Типы инструментов
                </Typography.Title>
                <Button type="primary" onClick={startCreate}>Новый тип</Button>
            </Flex>

            {error && <Typography.Text type="danger">{error}</Typography.Text>}

            <Form<ToolTypeInput>
                form={form}
                layout="vertical"
                initialValues={{sort_order: toolTypes.length, is_active: true}}
                onFinish={save}
            >
                <Flex gap={16} wrap="wrap" align="end">
                    <Form.Item
                        label="Название"
                        name="name"
                        rules={[{required: true, min: 2, max: 80}]}
                        style={{minWidth: 240}}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[
                            {required: true, min: 2, max: 80},
                            {pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "Латиница, цифры и дефисы"},
                        ]}
                        style={{minWidth: 240}}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Порядок" name="sort_order" rules={[{required: true}]}>
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item label="Активен" name="is_active" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={saving}>
                                {editingId ? "Сохранить" : "Создать"}
                            </Button>
                            {editingId && (
                                <Button onClick={startCreate}>Отмена</Button>
                            )}
                        </Space>
                    </Form.Item>
                </Flex>
            </Form>

            <Table
                loading={loading}
                pagination={false}
                dataSource={toolTypes.map((toolType) => ({...toolType, key: toolType.id}))}
                columns={columns}
            />
        </Flex>
    );
};

export default ToolTypesPage;
