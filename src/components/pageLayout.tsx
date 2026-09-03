import {useLocation, useNavigate} from "react-router-dom";
import {Button, Layout, Menu, MenuProps} from "antd";
import {FC, PropsWithChildren, useContext} from "react";
import logo from '../assets/logo.svg'
import {AuthContext} from "../context/authContext";

const {Header, Content} = Layout;

const items: MenuProps["items"] = [
    {
        label: "Категории",
        key: "category",
    },
    {
        label: "Инструмент",
        key: "tools",
    },
    {
        label: "Типы",
        key: "tool-types",
    },
    {
        label: "Аккаунт",
        key: "account",
    },
];

const PageLayout: FC<PropsWithChildren> = ({children}) => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const {logout} = useContext(AuthContext);

    return (
        <Layout style={{width: "100%", minHeight: "100vh"}} color='#eeeeee'>
            <Header style={{display: "flex", alignItems: "center", gap: 16}}>
                <img src={logo} alt='' style={{width: 40, height: 40}}/> 
                <Menu
                    mode="horizontal"
                    theme="dark"
                    style={{flex: 1, minWidth: 0}}
                    items={items}
                    selectedKeys={[pathname.split("/")[1]]}
                    onClick={({key}) => navigate(`/${key}`)}
                />
                <Button onClick={() => logout()}>Выйти</Button>
            </Header>
            <Content style={{padding: 24}}>{children}</Content>
        </Layout>
    );
};

export default PageLayout;
