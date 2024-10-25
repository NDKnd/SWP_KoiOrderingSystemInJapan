import { Layout, Menu } from "antd";
import {
  FaHistory,
  FaSignOutAlt,
  FaUserCog,
  FaUserAlt,
  FaTruckPickup,
  FaCogs,
} from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom"; // Import useNavigate
import "../../Components/SideMenu/SideMenu.css";

function SaleLayOut() {
  const navigate = useNavigate(); // Khai báo useNavigate

  const contentAccount = [
    {
      key: 0,
      label: "General",
      icon: <FaCogs />,
      path: "/sale",
    },
    {
      key: 2,
      label: "Logout",
      icon: <FaSignOutAlt />,
      render: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      },
    },
  ];

  const handleMenuSelect = ({ keyPath }) => {
    // Dùng keyPath để tìm menu được chọn
    const selectedKey = keyPath[0]; // Lấy key của menu item
    console.log("selectedKey: ", selectedKey);

    // Tìm trong content
    const selectedItem = contentAccount
      .flatMap((item) => [item, ...(item.children || [])])
      .find((item) => item.key == selectedKey);

    if (selectedItem?.path) {
      // Nếu selectedItem có path
      navigate(selectedItem.path); // Điều hướng đến path tương ứng
    } else {
      selectedItem.render();
    }
  };

  const { Content, Sider } = Layout;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Sider
          width={200}
          style={{
            background: "#fff",
          }}
        >
          <Menu
            defaultOpenKeys={["1"]}
            className="custom-menu"
            mode="inline"
            items={contentAccount}
            onSelect={handleMenuSelect}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "#fff",
              borderRadius: 10,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default SaleLayOut;
