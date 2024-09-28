import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập hay chưa
    const token = localStorage.getItem("token");
    if (!token) {
      // Nếu chưa đăng nhập thì chuyển đến trang login
      navigate("/login");
    }
  }, []);

  return <Outlet />; // Render các component con nếu đã đăng nhập
};

export default PrivateRoute;
