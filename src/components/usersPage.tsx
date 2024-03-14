import React, {useContext} from 'react';
import UsersTable from "./usersTable";
import {Card} from "antd";
import {AuthContext} from "../context/authContext";
import {USER_ROLE} from "../services/userService";
import {Link} from "react-router-dom";

const UsersPage = () => {
    const {user} = useContext(AuthContext)

    return (
        <div>
            <Card title="Текущий пользователь" bordered={false} style={{width: 300, marginBottom: 16}}>
                {user?.name && < p><b>Ник: </b> {user.name}</p>}
                {user?.first_name && < p><b>Имя: </b> {user.first_name}</p>}
                {user?.last_name && < p><b>Фамилия: </b> {user.last_name}</p>}
                {user?.role && < p><b>Роль: </b> {user.role === USER_ROLE.ADMIN ? "Администратор" : "Пользователь"}</p>}
                {user?.email && < p><b>Почта: </b> {user.email}</p>}
                {user?.phone && < p><b>Номер телефона: </b> {user.phone}</p>}
                <Link to={'/user/' + user?.id}>Редактировать</Link>
            </Card>
            <UsersTable/>
        </div>
    );
};

export default UsersPage;