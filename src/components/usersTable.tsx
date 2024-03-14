import React, {useContext} from 'react';
import {useFetch} from "../hooks/useFetch";
import {Link, useNavigate} from "react-router-dom";
import Loader from "./loader";
import {Button, Flex, Table} from "antd";
import {AuthContext} from "../context/authContext";
import {getAllUsers, IUser} from "../services/userService";
import {ColumnsType} from "antd/es/table";


const columns: ColumnsType<IUser> = [
    {
        title: 'Имя пользователя',
        dataIndex: "name",
        key: "name",
        render: (text, record) => <Link to={`/user/${record.id}`}>{text}</Link>,
    },
    {
        title: "Роль",
        dataIndex: "role",
        key: "role",
    },
];


const UsersTable = () => {
    const {token, user: currentUser} = useContext(AuthContext)

    const {loading, data: users} = useFetch(getAllUsers(token));
    const navigate = useNavigate();

    if (loading || !users) return <Loader/>;


    return (
        <Flex vertical gap={16}>
            <Button
                type="primary"
                onClick={() => navigate("/user/create")}
            >
                Добавить пользователя
            </Button>
            <Table
                pagination={false}
                dataSource={users.filter(user => user.id !== currentUser?.id).map((user) => ({...user, key: user.id}))}
                columns={columns}
            />
        </Flex>
    );
};

export default UsersTable;