import { useEffect, useState } from "react";
import { Avatar, Badge } from "antd";
import "./Header.css";
import path_css from "./Header.module.css";
import { FaHome, FaAngleDown, FaShoppingBag } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../services/axios";

function Header() {
  //for getting user token
  // for example
  // localStorage.setItem("token", "hehe I am here");
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  // console.log(token);
  const userInfo = JSON.parse(user); // data user
  // console.log(userInfo);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // try {
        //   const res = await api.get("/cart");
        //   console.log(res.data);
        //   setQuantity(res.data.length);
        // } catch (error) {
        //   console.log(error);
        // }
        console.log(`user name: ${userInfo.username}`);
      } else {
        console.log("not login yet");
      }
    };
    fetchData();
  }, [user]);

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
            <li className="opt">Opt3</li>
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
      {!token ? (
        <div className="nav-item">
          <p className="title">Join Us</p>
          <FaAngleDown />
          <ul className="dropdown last">
            <div className="drop-conts last">
              <li className="opt">
                <NavLink to="/login">Login</NavLink>
              </li>
              <li className="opt">
                <NavLink to="/login">Register</NavLink>
              </li>
            </div>
          </ul>
        </div>
      ) : (
        <>
          <div className={path_css.nav_item}>
            <NavLink to="/orders">
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
                  md: 40,
                }}
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
