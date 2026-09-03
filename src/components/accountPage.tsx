import React, {useContext} from "react";
import {Card} from "antd";
import {AuthContext} from "../context/authContext";
import UserChangePasswordForm from "./userChangePasswordForm";

const AccountPage = () => {
    const {user} = useContext(AuthContext);

    return (
        <div>
            <Card title="Администратор" bordered={false} style={{maxWidth: 480}}>
                <p><b>Логин:</b> {user?.name}</p>
                {user?.first_name && <p><b>Имя:</b> {user.first_name}</p>}
                {user?.last_name && <p><b>Фамилия:</b> {user.last_name}</p>}
                {user?.email && <p><b>Почта:</b> {user.email}</p>}
            </Card>
            <UserChangePasswordForm/>
        </div>
    );
};

export default AccountPage;
