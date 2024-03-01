import { useFetch } from "../hooks/useFetch";
import { ICategory, getAllCategories } from "../services/categoryService";
import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
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

  if (loading || !categories) {
    return <Loader />;
  }

  return (
    <Table
      dataSource={categories.map((cat) => ({ ...cat, key: cat.id }))}
      columns={columns}
    />
  );
};

export default CategoriesPage;
