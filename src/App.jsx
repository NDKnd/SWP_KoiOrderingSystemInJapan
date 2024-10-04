import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./Pages/Error/Error.jsx";
import LoginForm from "./Pages/Login/LoginForm.jsx";
import Home from "./Pages/Home/Home.jsx";
import PrivateRoute from "./Components/private-rout/PrivateRoute.jsx";
import Account from "./Pages/Account/Account.jsx";
import KoiPageFind from "./Pages/Kois/KoiPageFind.jsx";
import MenuList from "./Components/manager-header/MenuList.jsx";
import { Layout } from "antd";
import ManagerHome from "./Pages/Manager/ManagerHome";
import PendingOrder from "./Pages/Manager/PendingOrder.jsx";
import OrderHistory from "./Pages/Manager/OrderHistory.jsx";
import ManagerFarm from "./Pages/Manager/ManagerFarm";
import ManagerKoi from "./Pages/Manager/ManagerKoi";
import { Outlet } from "react-router-dom";
import TestUpFile from "./utils/testUpFile";

const { Content, Sider } = Layout;

const ManagerLayout = () => (
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

const routes = [
  { path: "/", element: <Home /> },
  { path: "login", element: <LoginForm /> },
  {
    path: "admin",
    element: <ManagerLayout />,
    children: [
      { path: "", element: <ManagerHome /> },
      { path: "ManagerFarm", element: <ManagerFarm /> },
      { path: "ManagerKoi", element: <ManagerKoi /> },
      { path: "ManagerPendingOrder", element: <PendingOrder /> },
      { path: "ManagerOrderHistory", element: <OrderHistory /> },
    ],
  },
  {
    path: "KoiPageFind",
    element: <PrivateRoute />,
    children: [{ path: "", element: <KoiPageFind /> }],
  },
  {
    path: "profile",
    element: <PrivateRoute />,
    children: [{ path: "", element: <Account /> }],
  },
  { path: "*", element: <Error /> },
];

const App = () => {
  const router = createBrowserRouter(
    routes.map((route) => ({
      ...route, // cú pháp spread (...) để sao chép tất cả các thuộc tính hiện có của route.
      errorElement: <Error />,
      children: route.children?.map((child) => ({
        ...child, // cú pháp spread (...) để sao chép tất cả các thuộc tính hiện có của child.
        errorElement: <Error />,
      })),
    }))
  );

  return <RouterProvider router={router} />;
};

export default App;
