import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import MenuList from "../../Components/deliver-header/MenuList";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";

const DeliverLayOut = () => (
  <Layout style={{ minHeight: "100vh" }}>
    <Sider>
      <MenuList />
    </Sider>
    <Layout>
      <Content style={{ padding: "24px", backgroundColor: "#fff" }}>
        <Outlet />
      </Content>
    </Layout>
  </Layout>
);

export default DeliverLayOut;