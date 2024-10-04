import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./Pages/Error/Error.jsx";
import LoginForm from "./Pages/Login/LoginForm.jsx";
import Home from "./Pages/Home/Home.jsx";
import PrivateRoute from "./Components/private-rout/PrivateRoute.jsx";
import Account from "./Pages/Account/Account.jsx";
import KoiPageFind from "./Pages/Kois/KoiPageFind.jsx";

//manager
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
const ManagerLayout = () => {
  return (
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
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      // element: <Home />,
      element: <TestUpFile />,
      errorElement: <Error />,
    },
    {
      path: "login",
      element: <LoginForm />,
      errorElement: <Error />,
    },
    {
      path: "admin",
      element: <PrivateRoute />,
      errorElement: <Error />,
      children: [
        {
          path: "",
          element: <ManagerLayout />,
          children: [
            {
              path: "",
              element: <ManagerHome />,
            },
            {
              path: "ManagerFarm",
              element: <ManagerFarm />,
            },
            {
              path: "ManagerKoi",
              element: <ManagerKoi />,
            },
            {
              path: "ManagerPendingOrder",
              element: <PendingOrder />,
            },
            {
              path: "ManagerOrderHistory",
              element: <OrderHistory />,
            },
            // {
            //   path: "settings",
            //   element: <Settings />, // Route for settings
            // },
          ],
        },
      ],
    },
    {
      path: "KoiPageFind",
      element: <PrivateRoute />,
      children: [
        {
          path: "",
          element: <KoiPageFind />,
        },
      ],
      errorElement: <Error />,
    },
    {
      path: "profile",
      element: <PrivateRoute />,
      children: [
        {
          path: "",
          element: <Account />,
        },
      ],
      errorElement: <Error />,
    },
    {
      path: "*",
      element: <Error />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
