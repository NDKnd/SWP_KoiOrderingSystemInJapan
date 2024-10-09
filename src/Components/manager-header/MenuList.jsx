import { Menu } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { PiFarmBold } from "react-icons/pi";
import { IoCarSharp, IoFish } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
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

  const menuItems = [
    { key: "/admin", label: "Home", icon: <HomeOutlined />, path: "/admin" },
    {
      key: "bill",
      label: "Bill",
      icon: <RiBillFill />,
      subMenu: [
        {
          key: "/admin/ManagerPendingOrder",
          label: "Pending order",
          path: "/admin/ManagerPendingOrder",
        },
        {
          key: "/admin/ManagerOrderHistory",
          label: "History",
          path: "/admin/ManagerOrderHistory",
        },
      ],
    },
    {
      key: "/admin/ManagerFarm",
      label: "Farm",
      icon: <PiFarmBold />,
      path: "/admin/ManagerFarm",
    },
    {
      key: "/admin/ManagerKoi",
      label: "Koi",
      icon: <IoFish />,
      path: "/admin/ManagerKoi",
    },
    {
      key: "/admin/ManagerTrip",
      label: "Trip",
      icon: <IoCarSharp />,
      path: "/admin/ManagerTrip",
    },
    {
      key: "/admin/Setting",
      label: "Setting",
      icon: <IoMdSettings />,
      path: "/admin/Setting",
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
            onClick={() => handleNavigate(item.path)}
          >
            {item.label}
          </Menu.Item>
        )
      )}
    </Menu>
  );
};

export default MenuList;
