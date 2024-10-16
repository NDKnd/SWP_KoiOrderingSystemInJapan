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
import Account_profile from "./Pages/Account/Account_profile.jsx";
import ForgotPass from "./Pages/Account/ForgotPass.jsx";
import ResetPass from "./Pages/Account/Reset_password.jsx";

const List_Imp_Role = [
  "MANAGER",
  "SALE_STAFF",
  "CONSULTING_STAFF",
  "DELIVERING_STAFF",
];
const Less_Role = ["CUSTOMER"];

const routes = [
  { path: "/", element: <Home /> }, // not need token
  { path: "login", element: <LoginForm /> }, // not need token
  { path: "forgot", element: <ForgotPass /> },
  { path: "reset-password", element: <ResetPass /> },
  {
    path: "admin",
    element: <PrivateRoute allow_Role={List_Imp_Role} />, //Bảo vệ trang
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
  { path: "KoiPageFind", element: <KoiPageFind /> }, // not need token
  { path: "FarmFindPage", element: <FarmFindPage /> }, // not need token
  {
    path: "profile",
    element: <PrivateRoute allow_Role={Less_Role} />,
    children: [
      {
        path: "",
        element: <Account />,
        children: [
          { path: "detail", element: <Account_profile /> },
          { path: "trips", element: <Trips /> },
        ],
      },
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
