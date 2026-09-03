import React, {useCallback, useEffect, useState} from "react";
import {
    Alert,
    Button,
    Flex,
    Form,
    Input,
    InputNumber,
    Modal,
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

const getErrorMessage = (requestError: unknown, fallback: string) => {
    if (!isAxiosError(requestError)) return fallback;

    const responseMessage = requestError.response?.data?.message;
    if (Array.isArray(responseMessage)) return responseMessage.join(". ");
    if (typeof responseMessage === "string" && responseMessage.trim()) return responseMessage;
    if (!requestError.response) return "Не удалось связаться с сервером. Проверьте подключение к интернету";
    return fallback;
};

const ToolTypesPage = () => {
    const [form] = Form.useForm<ToolTypeInput>();
    const [toolTypes, setToolTypes] = useState<IToolType[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageError, setPageError] = useState("");
    const [formError, setFormError] = useState("");

    const loadToolTypes = useCallback(async () => {
        setLoading(true);
        try {
            setToolTypes(await getToolTypes());
            setPageError("");
        } catch (requestError) {
            setPageError(getErrorMessage(requestError, "Не удалось загрузить типы инструментов"));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadToolTypes();
    }, [loadToolTypes]);

    const startCreate = () => {
        setEditingId(null);
        setFormError("");
        form.resetFields();
        form.setFieldsValue({
            slug: "",
            name: "",
            sort_order: toolTypes.length,
            is_active: true,
        });
        setModalOpen(true);
    };

    const startEdit = (toolType: IToolType) => {
        setEditingId(toolType.id);
        setFormError("");
        form.setFieldsValue(toolType);
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;
        setModalOpen(false);
        setFormError("");
        form.resetFields();
    };

    const save = async (values: ToolTypeInput) => {
        setSaving(true);
        setFormError("");
        try {
            if (editingId !== null) {
                await updateToolType(editingId, values);
            } else {
                await createToolType(values);
            }
            setModalOpen(false);
            form.resetFields();
            await loadToolTypes();
        } catch (requestError) {
            setFormError(getErrorMessage(requestError, "Не удалось сохранить тип инструмента"));
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: number) => {
        setPageError("");
        try {
            await deleteToolType(id);
            await loadToolTypes();
        } catch (requestError) {
            setPageError(getErrorMessage(requestError, "Не удалось удалить тип инструмента"));
        }
    };

    const columns: ColumnsType<IToolType> = [
        {title: "Название", dataIndex: "name"},
        {
            title: "Системный код",
            dataIndex: "slug",
            render: (slug: string) => <Typography.Text code>{slug}</Typography.Text>,
        },
        {title: "Порядок", dataIndex: "sort_order", width: 110},
        {
            title: "Статус",
            dataIndex: "is_active",
            width: 120,
            render: (isActive: boolean) => isActive
                ? <Tag color="green">Активен</Tag>
                : <Tag>Скрыт</Tag>,
        },
        {
            title: "Действия",
            width: 230,
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
            <Flex justify="space-between" align="center" gap={16} wrap="wrap">
                <Typography.Title level={2} style={{margin: 0}}>
                    Типы инструментов
                </Typography.Title>
                <Button type="primary" onClick={startCreate}>Новый тип</Button>
            </Flex>

            {pageError && (
                <Alert
                    type="error"
                    showIcon
                    closable
                    message="Ошибка"
                    description={pageError}
                    onClose={() => setPageError("")}
                />
            )}

            <Table
                loading={loading}
                pagination={false}
                dataSource={toolTypes.map((toolType) => ({...toolType, key: toolType.id}))}
                columns={columns}
                scroll={{x: 760}}
            />

            <Modal
                open={modalOpen}
                title={editingId !== null ? "Редактирование типа" : "Новый тип инструмента"}
                okText={editingId !== null ? "Сохранить" : "Создать"}
                cancelText="Отмена"
                confirmLoading={saving}
                closable={!saving}
                maskClosable={!saving}
                onOk={() => form.submit()}
                onCancel={closeModal}
                width={560}
                forceRender
            >
                <Form<ToolTypeInput>
                    form={form}
                    layout="vertical"
                    onFinish={save}
                >
                    {formError && (
                        <Alert
                            type="error"
                            showIcon
                            message="Не удалось сохранить изменения"
                            description={formError}
                            style={{marginBottom: 20}}
                        />
                    )}

                    <Form.Item
                        label="Название"
                        name="name"
                        rules={[
                            {required: true, message: "Введите название типа"},
                            {min: 2, message: "Название должно содержать не менее 2 символов"},
                            {max: 80, message: "Название должно содержать не более 80 символов"},
                        ]}
                    >
                        <Input placeholder="Например, Электроинструмент" autoFocus />
                    </Form.Item>

                    <Form.Item
                        label="Системный код"
                        name="slug"
                        extra="Используется в системе. Введите строчные латинские буквы, цифры или дефисы."
                        rules={[
                            {required: true, message: "Введите системный код"},
                            {min: 2, message: "Системный код должен содержать не менее 2 символов"},
                            {max: 80, message: "Системный код должен содержать не более 80 символов"},
                            {
                                pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                message: "Используйте только строчные латинские буквы, цифры и дефисы",
                            },
                        ]}
                    >
                        <Input placeholder="Например, power-tools" />
                    </Form.Item>

                    <Form.Item
                        label="Порядок отображения"
                        name="sort_order"
                        extra="Типы с меньшим значением показываются первыми."
                        rules={[{required: true, message: "Укажите порядок отображения"}]}
                    >
                        <InputNumber min={0} precision={0} style={{width: "100%"}} />
                    </Form.Item>

                    <Form.Item
                        label="Доступен для выбора"
                        name="is_active"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Да" unCheckedChildren="Нет" />
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>
    );
};

export default ToolTypesPage;
