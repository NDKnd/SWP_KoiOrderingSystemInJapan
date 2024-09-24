import React, { useEffect, useState } from "react";
import './LoginForm.css'
import { FaUser, FaEye, FaEyeSlash, FaEnvelope, FaPen, FaLock } from "react-icons/fa"
import api from "./../../services/axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {

    //for tranfsition from login to regis
    const [action, setAction] = useState('');
    const registerLink = () => {
        setAction('active');
    }
    const loginLink = () => {
        setAction('');
    }

    // for seeing Password
    const [see, setSee] = useState(true);
    const togglePassword = (event) => {
        setSee(prevState => !prevState);
    }
    useEffect(() => {
        setSee()
    }
        , [setSee])
    // for Confirm Password
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (password !== value) {
            e.target.setCustomValidity('Password and Confirm Password do not match!');
        } else {
            e.target.setCustomValidity('');
        }
    };

    //handle login
    const navigatie = useNavigate()

    const handleLogin = async (event) => {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form
        const formData = new FormData(event.target); // Lấy dữ liệu form
        const userName = formData.get('username'); // Lấy giá trị của trường Username
        const password = formData.get('password'); // Lấy giá trị của trường Password
        console.log("Username:", userName);
        console.log("Password:", password);

        try{
            // const response = await api.get.post("login",userName,password);
            // const {token} = response.data;
            // localStorage.setItem("token", token);
            // localStorage.setItem("user",JSON.stringify(response.data));
            navigatie("/");
        } catch (err){
            console.log(err);
            alert("Username or Password is invalid!");
        }
        
    };

    //handle registration
    const handleRegitration = (event) => {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form
        const formData = new FormData(event.target); // Lấy dữ liệu form
        const userName = formData.get('username'); // Lấy giá trị của trường Username
        const firstName = formData.get('firstname'); // Lấy giá trị của trường Password
        const lastName = formData.get('lastname'); // Lấy giá trị của trường Password
        const email = formData.get('email'); // Lấy giá trị của trường Password
        const password = formData.get('password'); // Lấy giá trị của trường Password
        console.log("Username:", userName);
        console.log("Firstname:", firstName);
        console.log("Lastname:", lastName);
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <div className="login-body">
            <div className={`wrapper ${action}`}>
                <div className="form-box login">
                    <form action="" onSubmit={handleLogin}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input type="text" name="username" placeholder="Username" required></input>
                            <FaUser className="icon"></FaUser>
                        </div>
                        <div className="input-box">
                            <input type={see ? "text" : "password"} name="password" placeholder="Password" required></input>
                            {see ?
                                <FaEyeSlash className="icon" onClick={() => togglePassword()} />
                                : <FaEye className="icon" onClick={() => togglePassword()} />
                            }
                        </div>
                        <div className="remember-forgot">
                            <label><input type="checkbox"></input>Remember me</label>
                            <a href="#">Forgot password?</a>
                        </div>
                        <button type="submit">Login</button>
                        <div className="register-link">
                            <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
                        </div>
                    </form>

                </div>

                <div className="form-box register">
                    <form action="" onSubmit={handleRegitration}>
                        <h1>Registraion</h1>

                        <div className="input-box">
                            <input type="text" placeholder="Username" name="username" required></input>
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="text" placeholder="First name" name="firstname" required></input>
                            <FaPen className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="text" placeholder="Last name" name="lastname" required></input>
                            <FaPen className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="email" placeholder="Email" name="email" required></input>
                            <FaEnvelope className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type={see ? "text" : "password"}
                                id="password"
                                value={password}
                                placeholder="Password"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {see ?
                                <FaEyeSlash className="icon" onClick={() => togglePassword()} />
                                : <FaEye className="icon" onClick={() => togglePassword()} />
                            }
                        </div>
                        <div className="input-box">
                            <input
                                type={see ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                placeholder="Confirm password"
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                            {see ?
                                <FaEyeSlash className="icon" onClick={() => togglePassword()} />
                                : <FaEye className="icon" onClick={() => togglePassword()} />
                            }
                        </div>
                        <div className="remember-forgot">
                            <label><input type="checkbox" required></input>
                                I agree to the terms & conditions
                            </label>
                        </div>

                        <button type="submit">Register</button>
                        <div className="register-link">
                            <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm

