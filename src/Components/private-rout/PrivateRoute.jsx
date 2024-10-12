import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập hay chưa
    const token = localStorage.getItem("token");
    if (!token || tokenExpired(token) == true) {
      // Nếu chưa đăng nhập thì chuyển đến trang login
      navigate("/");
    } else {
      const role = JSON.parse(localStorage.getItem("user")).role;
      console.log("role through privateRouter:", role);
      if (["MANAGER", "DELEVIRING_STAFF", "SALE_STAFF"].includes(role)) {
        navigate("/admin");
      }
    }
  }, [navigate]);
  // Kiểm tra token đã hết hạn hay ch?
  const tokenExpired = (token) => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Token không hợp lệ: phải có 3 phần."); // token kieu SWT
      }
      // const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      // console.log("Header:", header);
      // console.log("Payload:", payload);
      const IsExp = payload.exp * 1000 < Date.now(); // Kiểm tra thời gian hết hạn
      // console.log("Token hết hợp lệ:", expTime);
      return IsExp;
    } catch (e) {
      console.error("Token không hợp lệ:", e); // Nếu có lỗi, in ra lỗi
      return true;
    }
  };

  return <Outlet />; // Render các component con nếu đã đăng nhập
};

export default PrivateRoute;
