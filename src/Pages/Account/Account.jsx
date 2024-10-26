import { Layout, Menu } from "antd";
import {
  FaHistory,
  FaSignOutAlt,
  FaUserCog,
  FaUserAlt,
  FaTruckPickup,
  FaCogs,
  FaShoppingCart,
} from "react-icons/fa";
import Headers from "../../Components/Header/Header";
import { Outlet, useNavigate } from "react-router-dom"; // Import useNavigate
import "../../Components/SideMenu/SideMenu.css";
import { FaShop } from "react-icons/fa6";

function Account() {
  const navigate = useNavigate(); // Khai báo useNavigate

  const contentAccount = [
    {
      key: 0,
      label: "General",
      icon: <FaCogs />,
      path: "/profile/general",
    },
    {
      key: 1,
      label: "Account",
      icon: <FaUserAlt />,
      children: [
        {
          key: 1.1,
          label: "Detail",
          icon: <FaUserCog />,
          path: "/profile/detail", // Đường dẫn tới trang Profile
        },
        {
          key: 1.2,
          label: "History",
          icon: <FaHistory />,
          path: "#", // Đường dẫn tới trang History
        },
        {
          key: 1.3,
          label: "Trips",
          icon: <FaTruckPickup />,
          path: "/profile/trips", // Đường dẫn tới trang Orders
        },
        {
          key: 1.4,
          label: "Orders",
          icon: <FaShoppingCart />,
          path: "/profile/orders", // Đường dẫn tới trang Settings
        },
      ],
    },
    {
      key: 2,
      label: "Logout",
      icon: <FaSignOutAlt />,
      render: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      },
    },
  ];

  const handleMenuSelect = ({ keyPath }) => {
    // Dùng keyPath để tìm menu được chọn
    const selectedKey = keyPath[0]; // Lấy key của menu item
    console.log("selectedKey: ", selectedKey);

    // Tìm trong contentAccount
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
      <Headers />
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

export default Account;
