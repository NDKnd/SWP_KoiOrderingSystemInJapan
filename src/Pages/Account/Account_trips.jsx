import { Layout, Menu, Divider, ConfigProvider, Tabs } from "antd";
import {
  FaHistory,
  FaSignOutAlt,
  FaUserCog,
  FaUserAlt,
  FaTruckPickup,
} from "react-icons/fa";
import AllTrip from "../../Pages/Account/AllTrips";
import Headers from "../../Components/Header/Header";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../Components/SideMenu/SideMenu.css";

const contentAccount = [
  {
    key: 1,
    label: "Account",
    icon: <FaUserAlt />,
    children: [
      {
        key: 1.0,
        label: "Profile",
        icon: <FaUserCog />,
        path: "/profile", // Đường dẫn tới trang Profile
      },
      {
        key: 1.1,
        label: "History",
        icon: <FaHistory />,
        path: "/profile/history", // Đường dẫn tới trang History
      },
      {
        key: 1.2,
        label: "Trips",
        icon: <FaTruckPickup />,
        path: "/profile/trips", // Đường dẫn tới trang Orders
      },
    ],
  },
  {
    key: 2,
    label: "Logout",
    icon: <FaSignOutAlt />,
    path: "/logout", // Đường dẫn tới trang Logout
  },
];
const tabPanels = [{ id: 1, label: "All", content: <AllTrip /> }];

function trips() {
  const navigate = useNavigate; // Khai báo useNavigate

  const handleMenuSelect = ({ keyPath }) => {
    // Dùng keyPath để tìm menu được chọn
    const selectedKey = keyPath[0]; // Lấy key của menu item

    // Tìm trong contentAccount
    const selectedItem = contentAccount
      .flatMap((item) => [item, ...(item.children || [])])
      .find((item) => item.key == selectedKey);

    if (selectedItem?.path) {
      navigate(selectedItem.path); // Điều hướng đến path tương ứng
    }
  };

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
            defaultSelectedKeys={["1.0"]}
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
            <Divider orientation="right">
              <h3>Trips</h3>
            </Divider>
            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    colorPrimary: "var(--purple1)",
                    itemHoverColor: "var(--purple2)",
                    itemActiveColor: "var(--purple5)",
                  },
                },
              }}
            >
              <Tabs>
                {tabPanels.map((item) => (
                  <Tabs.TabPane tab={item.label} key={item.id}>
                    {item.content}
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </ConfigProvider>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default trips;
