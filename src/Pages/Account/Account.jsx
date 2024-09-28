import React, { useEffect } from "react";
import axios from "axios";
import api from "../../services/axios";
import Headers from "../../Components/Header/Header";

import { Breadcrumb, Layout, Menu } from "antd";
import {
  FaHistory,
  FaShoppingBag,
  FaSignOutAlt,
  FaUserCog,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function Account() {
  const navigate = useNavigate;
  // const fetchData = async () => {
  //   const res = await axios.post(api);

  //   console.log(res.data);
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const contentAccount = [
    {
      key: 1,
      label: "Account",
      icon: <FaUserCog />,
      children: [
        {
          key: 1.1,
          label: "History",
          icon: <FaHistory />,
          path: "/profile/history",
        },
        {
          key: 1.2,
          label: "Order",
          icon: <FaShoppingBag />,
          path: "/profile/card",
        },
      ],
    },
    {
      key: 2,
      label: "Logout",
      icon: <FaSignOutAlt />,
      path: "#",
    },
  ];

  const { Content, Sider } = Layout;

  return (
    <Layout>
      <Headers />
      <Layout>
        <Sider
          width={200}
          style={{
            background: "#fff",
          }}
        >
          <Menu
            items={contentAccount}
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["1"]}
            style={{
              height: "100%",
              borderRight: 0,
              backgroundColor: "var(--purple5)",
            }}
          >
            {contentAccount.map((item) => {
              return (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Breadcrumb
            items={[
              {
                title: "Home",
              },
              {
                title: "List",
              },
              {
                title: "App",
              },
            ]}
            style={{
              margin: "16px 0",
            }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "#fff",
              borderRadius: 10,
            }}
          >
            <h1>Account</h1>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Account;
