import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./Pages/Error/Error.jsx";
import LoginForm from "./Pages/Login/LoginForm.jsx";
import Home from "./Pages/Home/Home.jsx";
import PrivateRoute from "./Components/private-rout/PrivateRoute.jsx";
import Account from "./Pages/Account/Account.jsx";
import Trips from "./Pages/Account/Account_trips.jsx";
import KoiPageFind from "./Pages/Kois/KoiPageFind.jsx";
import ManagerHome from "./Pages/Manager/ManagerHome";
import PendingOrder from "./Pages/Manager/PendingOrder.jsx";
import OrderHistory from "./Pages/Manager/OrderHistory.jsx";
import ManagerFarm from "./Pages/Manager/ManagerFarm";
import ManagerKoi from "./Pages/Manager/ManagerKoi";
import ManagerTrip from "./Pages/Manager/ManagerTrip";
import ManagerLayOut from "./Pages/Manager/ManagerLayOut.jsx";
import FarmFindPage from "./Pages/Farms/FarmFindPage.jsx";

const routes = [
  {
    path: "/",
    element: <PrivateRoute />,
    children: [{ path: "/", element: <Home /> }],
  },
  { path: "login", element: <LoginForm /> },
  {
    path: "admin",
    element: <PrivateRoute />, //Bảo vệ trang
    children: [
      {
        path: "",
        element: <ManagerLayOut />, // Layout của trang quản lý
        children: [
          { path: "", element: <ManagerHome /> },
          { path: "ManagerFarm", element: <ManagerFarm /> },
          { path: "ManagerKoi", element: <ManagerKoi /> },
          { path: "ManagerTrip", element: <ManagerTrip /> },
          { path: "ManagerPendingOrder", element: <PendingOrder /> },
          { path: "ManagerOrderHistory", element: <OrderHistory /> },
        ],
      },
    ],
  },
  {
    path: "KoiPageFind",
    element: <PrivateRoute />,
    children: [{ path: "", element: <KoiPageFind /> }],
  },
  {
    path: "FarmFindPage",
    element: <PrivateRoute />,
    children: [{ path: "", element: <FarmFindPage /> }],
  },
  {
    path: "profile",
    element: <PrivateRoute />,
    children: [
      { path: "", element: <Account /> },
      { path: "trips", element: <Trips /> },
    ],
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
