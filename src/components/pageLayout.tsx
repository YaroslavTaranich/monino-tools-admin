import {useLocation, useNavigate} from "react-router-dom";
import {Layout, Menu, MenuProps} from "antd";
import {FC, PropsWithChildren} from "react";
import logo from '../assets/logo.svg'

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
        label: "Пользователи",
        key: "user",
    },
];

const PageLayout: FC<PropsWithChildren> = ({children}) => {
    const navigate = useNavigate();
    const {pathname} = useLocation();

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
            </Header>
            <Content style={{padding: 24}}>{children}</Content>
        </Layout>
    );
};

export default PageLayout;
