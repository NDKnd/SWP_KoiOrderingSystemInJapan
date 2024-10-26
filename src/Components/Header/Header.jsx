import { useEffect, useState, navigate } from "react";
import { Avatar, Badge } from "antd";
import "./Header.css";
import path_css from "./Header.module.css";
import { FaHome, FaAngleDown, FaShoppingBag } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../services/axios";

function Header() {
  const token = localStorage.getItem("token");
  if (token) {
    // showing how many time left for valid token
    const parts = token.split(".");
    const payload = JSON.parse(atob(parts[1]));
    // console.log("payload: ", payload);
    console.log("expired  token when : ", payload.exp * 1000);
    console.log("current time: ", Date.now());
    console.log("payload - token exp: ", payload.exp * 1000 - Date.now());
    if (payload.exp * 1000 - Date.now() < 0) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }
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
  // console.log(userInfo);
  const [quantity, setQuantity] = useState(0);

  const handleLogout = () => {
    const navigate = useNavigate;
    // Xoá token khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Điều hướng người dùng về trang đăng nhập
    navigate("/login");
  };

  const activeNav = () => {
    const pageActive = document.querySelector(".active");
    const parent = pageActive.parentElement;
    if (!parent.classList.contains("nav-item")) return;
    if (parent === null) return;
    parent.style.backgroundColor = "rgba(137, 43, 226, 0.174)";
    let newDiv = document.createElement("div");
    newDiv.style.position = "absolute";
    newDiv.style.bottom = "0";
    newDiv.style.width = "100%";
    newDiv.style.height = "0.1em";
    newDiv.style.backgroundColor = "rgba(137, 43, 226)";
    parent.appendChild(newDiv);
  };

  useEffect(() => {
    activeNav();
  }, []);

  return (
    <div className="navbar">
      <div className="nav-item">
        <NavLink to="/">
          <FaHome />
        </NavLink>
      </div>
      <div className="nav-item">
        <p className="title">Services</p>
        <FaAngleDown />
        <ul className="dropdown">
          <div className="drop-conts">
            <li className="opt">
              <NavLink to="/KoiPageFind">Kois</NavLink>
            </li>
            <li className="opt">
              <NavLink to="/FarmFindPage">Farms</NavLink>
            </li>
            <li className="opt">
              <NavLink to="/TripPage">Trips</NavLink>
            </li>
            <li className="opt">Opt4</li>
            <li className="opt">Opt5</li>
          </div>
        </ul>
      </div>
      <div className="nav-item">
        <p className="title">Title</p>
        <FaAngleDown />
        <ul className="dropdown">
          <div className="drop-conts">
            <li className="opt">Opt1</li>
            <li className="opt">Opt2</li>
            <li className="opt">Opt3</li>
          </div>
        </ul>
      </div>
      {!token || tokenExpired(token) ? (
        <div className="nav-item">
          <p className="title">Join Us</p>
          <FaAngleDown />
          <ul className="dropdown last">
            <div className="drop-conts last">
              <li className="opt">
                <NavLink to="/login">Login</NavLink>
              </li>
            </div>
          </ul>
        </div>
      ) : (
        <>
          <div className={path_css.nav_item}>
            <NavLink to="/profile/orders">
              <Badge count={quantity} className={path_css.badge}>
                <FaShoppingBag />
              </Badge>
            </NavLink>
          </div>
          <div className="nav-item">
            <p className="title">
              <Avatar
                size={{
                  xs: 24,
                  sm: 32,
                  md: 35,
                  lg: 37,
                  xl: 43,
                }}
                src="https://firebasestorage.googleapis.com/v0/b/koiorderingjapan.appspot.com/o/defAvatar%2Fkoi-4371460.svg?alt=media&token=e7c71b00-3b9f-4b54-af1f-4e4d580f6877"
              />
            </p>
            <ul className="dropdown last">
              <div className="drop-conts last">
                <li className="opt">
                  <NavLink to="/profile">Profile</NavLink>
                </li>
                <li className="opt">
                  <NavLink to="/account-setting">Settings</NavLink>
                </li>
                <li className="opt">
                  <NavLink onClick={() => handleLogout()}>Logout</NavLink>
                </li>
              </div>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
