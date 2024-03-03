import { useFetch } from "../hooks/useFetch";
import { ICategory, getAllCategories } from "../services/categoryService";
import { Button, Flex, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./loader";

const columns: ColumnsType<ICategory> = [
  //   {
  //     title: "Название eng",
  //     dataIndex: "name",
  //     key: "name",
  //   },
  {
    title: "Название",
    dataIndex: "label",
    key: "label",
  },
  //   {
  //     title: "Заголовок",
  //     dataIndex: "title",
  //     key: "title",
  //   },
  {
    title: "Описание",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link to={`/category/${record.id}`}>Редактировать</Link>
      </Space>
    ),
  },
];

const CategoriesPage = () => {
  const { data: categories, loading } = useFetch(getAllCategories());
  const navigate = useNavigate();

  if (loading || !categories) {
    return <Loader />;
  }

  return (
    <Flex vertical gap={16}>
      <Button type="primary" onClick={() => navigate("/category/create")}>
        Создать категорию
      </Button>
      <Table
        dataSource={categories.map((cat) => ({ ...cat, key: cat.id }))}
        columns={columns}
      />
    </Flex>
  );
};

export default CategoriesPage;
