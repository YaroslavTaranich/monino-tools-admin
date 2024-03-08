import React, {FC} from "react";
import {getTools, getToolsByCategoryId, ITool,} from "../services/toolsService";
import {Button, Flex, Image, Table} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {ColumnsType} from "antd/es/table";
import {useFetch} from "../hooks/useFetch";
import Loader from "./loader";
import Fallback from '../assets/fallback-photo.jpg'

const columns: ColumnsType<ITool> = [
    {
        title: "Картинка",
        dataIndex: 'pic',
        key: "pic",
        render: (text, record) => (
            <Image src={`${process.env.REACT_APP_API_URL}/file/${record.image}`} width={50} fallback={Fallback}/>
        )
    },
    {
        title: "Название инструмента",
        dataIndex: "label",
        key: "label",
        render: (text, record) => <Link to={`/tools/${record.id}`}>{text}</Link>,
    },
    {
        title: "Цена",
        dataIndex: "price",
        key: "price",
        sorter: (a, b) => a.price - b.price,
    },
    {
        title: "Залог",
        dataIndex: "zalog",
        key: "zalog",
        sorter: (a, b) => a.zalog - b.zalog,
    },
];

interface IToolsTableProps {
    categoryId?: number;
}

const ToolsTable: FC<IToolsTableProps> = ({categoryId}) => {
    const {loading, data: tools} = useFetch(
        categoryId ? getToolsByCategoryId(categoryId) : getTools()
    );
    const navigate = useNavigate();

    if (loading) {
        return <Loader/>;
    }

    if (!tools) {
        return (
            <Flex gap={16} align="center" justify="center">
                <div>
                    {categoryId ? (
                        <>
                            "В категории ещё нет инструментов!"
                            <Link to="/tools/create">Добавить</Link>
                        </>
                    ) : (
                        "Инструмент отсутствует :("
                    )}
                </div>
            </Flex>
        );
    }

    return (
        <Flex vertical gap={16}>
            <Button
                type={categoryId ? "default" : "primary"}
                onClick={() => navigate("/tools/create")}
            >
                Добавить инструмент
            </Button>
            <Table
                pagination={false}
                dataSource={tools.map((tool) => ({...tool, key: tool.id}))}
                columns={columns}
            />
        </Flex>
    );
};

export default ToolsTable;
