import React, { useContext } from "react";
import { ITool, getTools } from "../services/toolsService";
import { Space, Table } from "antd";
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { useFetch } from "../hooks/useFetch";
import { AuthContext } from "../router";
import Loader from "./loader";

const columns: ColumnsType<ITool> = [
  {
    title: "Название",
    dataIndex: "label",
    key: "label",
  },
  {
    title: "Цена",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Залог",
    dataIndex: "zalog",
    key: "zalog",
  },
  {
    title: "Популярный",
    dataIndex: "pobular",
    key: "pobular",
    render: (_: any, { pobular }: any) => (pobular ? "Да" : "Нет"),
  },
  {
    title: "",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link to={`/tool/${record.id}`}>Редактировать</Link>
      </Space>
    ),
  },
];

const ToolsPage = () => {
  const { loading, data: tools } = useFetch(getTools());
  const { userData } = useContext(AuthContext);

  console.log(userData);

  if (loading || !tools) {
    return <Loader />;
  }

  return (
    <Table
      dataSource={tools.map((tool) => ({ ...tool, key: tool.id }))}
      columns={columns}
    />
  );
};

export default ToolsPage;
