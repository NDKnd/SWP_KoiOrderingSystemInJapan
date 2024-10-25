import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./Pages/Error/Error.jsx";

import LoginForm from "./Pages/Login/LoginForm.jsx";

import Home from "./Pages/Home/Home.jsx";
import KoiPageFind from "./Pages/Kois/KoiPageFind.jsx";

import PrivateRoute from "./Components/private-rout/PrivateRoute.jsx";

import ForgotPass from "./Pages/Account/ForgotPass.jsx";
import ResetPass from "./Pages/Account/Reset_password.jsx";
import Account from "./Pages/Account/Account.jsx";
import Account_profile from "./Pages/Account/Account_profile.jsx";
import Account_trips from "./Pages/Account/Account_trips.jsx";
import Account_generall from "./Pages/Account/Account_generall.jsx";
import Account_order from "./Pages/Account/Account_order.jsx";

import TripPage from "./Pages/Trip/TripPage.jsx";
import BookingStatusPage from "./Pages/Trip/BookingStatusPage.jsx";


import PendingOrder from "./Pages/Manager/PendingOrder.jsx";
import OrderHistory from "./Pages/Manager/OrderHistory.jsx";
import ManagerHome from "./Pages/Manager/ManagerHome";
import ManagerFarm from "./Pages/Manager/ManagerFarm";
import ManagerKoi from "./Pages/Manager/ManagerKoi";
import ManagerTrip from "./Pages/Manager/ManagerTrip";
import ManagerLayOut from "./Pages/Manager/ManagerLayOut.jsx";
import FarmFindPage from "./Pages/Farms/FarmFindPage.jsx";
import ManagerBooking from "./Pages/Manager/ManagerBooking.jsx";

import SaleLayOut from "./Pages/Sale_staff/SaleLayOut.jsx";
import Sale_Booking from "./Pages/Sale_staff/Sale_Booking.jsx";

import DeliverLayOut from "./Pages/Deliver/DeliverLayOut.jsx"
import DeliverHome from "./Pages/Deliver/DeliverHome.jsx";
import DeliverPendingOrder from "./Pages/Deliver/DeliverPendingOrder.jsx";
import DeliverOrderHistory from "./Pages/Deliver/DeliverOrderHistory.jsx";

import ConsultingLayOut from "./Pages/Consulting/ConsultingLayOut.jsx";
import ConsultingPage from "./Pages/Consulting/ConsultingPage.jsx";

const List_Imp_Role = [
  "MANAGER",
  "SALE_STAFF",
  "CONSULTING_STAFF",
  "DELEVIRING_STAFF",
];
const Less_Role = ["CUSTOMER"];

const AllRole = [...List_Imp_Role, ...Less_Role];

const routes = [
  { path: "login", element: <LoginForm /> }, // not need token
  { path: "forgot", element: <ForgotPass /> },
  { path: "reset-password", element: <ResetPass /> },
  {
    path: "/",
    element: <PrivateRoute allow_Role={AllRole} />,
    children: [
      { path: "/", element: <Home /> },
      { path: "KoiPageFind", element: <KoiPageFind /> },
      { path: "FarmFindPage", element: <FarmFindPage /> },
      { path: "book-status", element: <BookingStatusPage /> },
      { path: "TripPage", element: <TripPage /> },
    ]
  },

  {
    path: "admin",
    element: <PrivateRoute allow_Role="MANAGER" />, //Bảo vệ trang
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
          { path: "ManagerBooking", element: <ManagerBooking /> },
        ],
      },
    ],
  },
  {
    path: "sale",
    element: <PrivateRoute allow_Role={List_Imp_Role[1]} />, //Bảo vệ trang
    children: [
      {
        path: "",
        element: <SaleLayOut />, // Layout của trang quản lý sale
        children: [{ path: "", element: <Sale_Booking /> }],
      },
    ],
  },
  {
    path: "consulting",
    element: <PrivateRoute allow_Role={List_Imp_Role[2]} />, //Bảo vệ trang
    children: [
      {
        path: "",
        element: <ConsultingLayOut />, // Layout của trang tư vấn
        children: [{ path: "", element: <ConsultingPage /> }],
      },
    ],
  },
  {
    path: "deliver",
    element: <PrivateRoute allow_Role="DELEVIRING_STAFF" />, //Bảo vệ trang
    children: [
      {
        path: "",
        element: <DeliverLayOut />, // Layout của trang quản lý
        children: [
          { path: "", element: <DeliverHome /> },
          { path: "DeliverPendingOrder", element: <DeliverPendingOrder /> },
          { path: "DeliverOrderHistory", element: <DeliverOrderHistory /> },
        ],
      },
    ],
  },
  {
    path: "profile",
    element: <PrivateRoute allow_Role={Less_Role} />,
    children: [
      {
        path: "",
        element: <Account />,
        children: [
          { path: "general", element: <Account_generall /> },
          { path: "detail", element: <Account_profile /> },
          { path: "trips", element: <Account_trips /> },
          { path: "orders", element: <Account_order /> },
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
