import React, { useEffect, useState } from "react";
import "./LoginForm.css";
import { FaUser, FaEye, FaEyeSlash, FaEnvelope, FaPen } from "react-icons/fa";
import api from "./../../services/axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const LoginForm = () => {
  //for tranfsition from login to regis
  const [action, setAction] = useState("");
  const registerLink = () => {
    setAction("active");
  };
  const loginLink = () => {
    setAction("");
  };

  // for see password
  const [seeLoginPassword, setSeeLoginPassword] = useState(false);
  const [seeRegisterPassword, setSeeRegisterPassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  // Toggle cho form đăng nhập
  const toggleLoginPassword = () => {
    setSeeLoginPassword((prev) => !prev);
  };
  // Toggle cho form đăng ký
  const toggleRegisterPassword = () => {
    setSeeRegisterPassword((prev) => !prev);
  };
  // Toggle cho ô xác nhận mật khẩu
  const toggleConfirmPassword = () => {
    setSeeConfirmPassword((prev) => !prev);
  };

  // for Confirm Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password !== value) {
      e.target.setCustomValidity("Password and Confirm Password do not match!");
    } else {
      e.target.setCustomValidity("");
    }
  };

  //handle login/ register
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const formData = new FormData(event.target); // Lấy dữ liệu form
    const userName = formData.get("username"); // Lấy giá trị của trường Username
    const password = formData.get("password"); // Lấy giá trị của trường Password
    // console.log("Username:", userName);
    // console.log("Password:", password);

    try {
      const response = await api.post("login", {
        username: userName,
        password: password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response.data); // nhận thông báo lỗi từ backend
    }
  };

  //handle registration
  const handleRegitration = async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const formData = new FormData(event.target); // Lấy dữ liệu form
    const userName = formData.get("username"); // Lấy giá trị của trường Username
    const firstName = formData.get("firstname"); // Lấy giá trị của trường Password
    const lastName = formData.get("lastname"); // Lấy giá trị của trường Password
    const email = formData.get("email"); // Lấy giá trị của trường Password
    const password = formData.get("password"); // Lấy giá trị của trường Password
    // console.log("Username:", userName);
    // console.log("Firstname:", firstName);
    // console.log("Lastname:", lastName);
    // console.log("Email:", email);
    // console.log("Password:", password);
    try {
      const response = await api.post("register", {
        username: userName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: "CUSTOMER",
      });
      message.success("Register success!");
      loginLink();
    } catch (err) {
      console.log(err);
      alert(err.response.data); // nhận thông báo lỗi từ backend
    }
  };

  return (
    <div className="login-body">
      <div className={`wrapper ${action}`}>
        <div className="form-box login">
          <form action="" onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
              ></input>
              <FaUser className="icon"></FaUser>
            </div>
            <div className="input-box">
              <input
                type={seeLoginPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
              ></input>
              {seeLoginPassword ? (
                <FaEyeSlash
                  className="icon"
                  onClick={() => toggleLoginPassword()}
                />
              ) : (
                <FaEye className="icon" onClick={() => toggleLoginPassword()} />
              )}
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox"></input>Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit">Login</button>

            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <a href="#" onClick={registerLink}>
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>

        <div className="form-box register">
          <form action="" onSubmit={handleRegitration}>
            <h1>Registraion</h1>

            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                name="username"
                required
              ></input>
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="First name"
                name="firstname"
                required
              ></input>
              <FaPen className="icon" />
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Last name"
                name="lastname"
                required
              ></input>
              <FaPen className="icon" />
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
              ></input>
              <FaEnvelope className="icon" />
            </div>
            <div className="input-box">
              <input
                type={seeRegisterPassword ? "text" : "password"}
                id="password"
                value={password}
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {seeRegisterPassword ? (
                <FaEyeSlash
                  className="icon"
                  onClick={() => toggleRegisterPassword()}
                />
              ) : (
                <FaEye
                  className="icon"
                  onClick={() => toggleRegisterPassword()}
                />
              )}
            </div>
            <div className="input-box">
              <input
                type={seeConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm password"
                onChange={handleConfirmPasswordChange}
                required
              />
              {seeConfirmPassword ? (
                <FaEyeSlash
                  className="icon"
                  onClick={() => toggleConfirmPassword()}
                />
              ) : (
                <FaEye
                  className="icon"
                  onClick={() => toggleConfirmPassword()}
                />
              )}
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" required></input>I agree to the terms &
                conditions
              </label>
            </div>

            <button type="submit">Register</button>
            <div className="register-link">
              <p>
                Already have an account?{" "}
                <a href="#" onClick={loginLink}>
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
