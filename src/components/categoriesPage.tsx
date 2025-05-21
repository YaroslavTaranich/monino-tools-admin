import {useFetch} from "../hooks/useFetch";
import {getAllCategories, ICategory} from "../services/categoryService";
import {Button, Flex, Image, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {Link, useNavigate} from "react-router-dom";
import Loader from "./loader";
import ToolsTable from "./toolsTable";
import Fallback from "../assets/fallback-photo.jpg";
import React from "react";

const columns: ColumnsType<ICategory> = [
    {
        title: "Картинка",
        dataIndex: 'pic',
        key: "pic",
        render: (text, record) => (
            <Image src={`${process.env.REACT_APP_API_URL}/file/${record.image}`} width={50} fallback={Fallback}/>
        )
    },
    {
        title: "Категория",
        dataIndex: "label",
        key: "label",
        render: (text, record) => <Link to={`/category/${record.id}`}>{text}</Link>,
    },
    {
        title: "Описание",
        dataIndex: "description",
        key: "description",
    },
];

const CategoriesPage = () => {
    const {data: categories, loading} = useFetch(getAllCategories());
    const navigate = useNavigate();

    if (loading || !categories) {
        return <Loader/>;
    }

    const expandedRowRender = (
        category: ICategory,
        index: number,
        indent: number,
        expanded: boolean
    ) => {
        if (!expanded) return null;
        return <ToolsTable categoryId={category.id}/>;
    };

    return (
        <Flex vertical gap={16}>
            <Button type="primary" onClick={() => navigate("/category/create")}>
                Создать категорию
            </Button>
            <Table
                dataSource={categories.map((cat) => ({...cat, key: cat.id}))}
                columns={columns}
                expandable={{expandedRowRender}}
            />
        </Flex>
    );
};

export default CategoriesPage;