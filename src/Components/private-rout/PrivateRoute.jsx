import { message } from "antd";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PropType from "prop-types";

const PrivateRoute = ({ allow_Role = [] }) => {
  const navigate = useNavigate();
  console.log("allow_Role :", allow_Role);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    // handle not login
    if (!token || tokenExpired(token)) {
      navigate("/login");
      message.warning("Please login first");
      return;
    }


    if (token) {
      let userInfo;
      userInfo = JSON.parse(localStorage.getItem("user"));

      // handle role
      if (!allow_Role.includes(userInfo.role)) {
        message.error("You are not allowed to access that page");
        navigate("/");
        return;
      }

      console.log("role current:", userInfo.role);
      if (tokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }

  }, [navigate]);

  return <Outlet />; // Render các component con nếu đã đăng nhập
};

PrivateRoute.propTypes = {
  allow_Role: PropType.array,
};

export default PrivateRoute;
