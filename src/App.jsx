import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./Pages/Error/Error.jsx";
import LoginForm from "./Pages/Login/LoginForm.jsx";
import Home from "./Pages/Home/Home.jsx";
function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <Error />,
    },
    {
      path: "/login",
      element: <LoginForm />,
      errorElement: <Error />,
    },
    {
      path: "*",
      element: <Error />,
    }
  ])

  return <RouterProvider router={router} />;
}

export default App
