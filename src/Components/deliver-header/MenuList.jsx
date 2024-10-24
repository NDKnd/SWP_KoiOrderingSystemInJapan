import { Menu } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { IoLogOut } from "react-icons/io5";
import { RiBillFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import React, { useCallback } from "react";
import "./MenuList.css";

const MenuList = () => {
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { key: "/deliver", label: "Home", icon: <HomeOutlined />, path: "/deliver" },
    {
      key: "bill",
      label: "Bill",
      icon: <RiBillFill />,
      subMenu: [
        {
          key: "/deliver/DeliverPendingOrder",
          label: "Pending order",
          path: "/deliver/DeliverPendingOrder",
        },
        {
          key: "/deliver/DeliverOrderHistory",
          label: "Completed Order",
          path: "/deliver/DeliverOrderHistory",
        },
      ],
    },
    {
      key: "logout",
      label: "Logout",
      icon: <IoLogOut />,
      onClick: () => handleLogOut(),
    },
  ];

  return (
    <Menu theme="dark" mode="inline" className="menu-bar">
      {menuItems.map((item) =>
        item.subMenu ? (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {item.subMenu.map((subItem) => (
              <Menu.Item
                key={subItem.key}
                onClick={() => handleNavigate(subItem.path)}
              >
                {subItem.label}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={
              item.onClick ? item.onClick : () => handleNavigate(item.path)
            }
          >
            {item.label}
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

export default MenuList;
