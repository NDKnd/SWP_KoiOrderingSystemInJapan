import React, { useEffect, useState } from "react";
import './LoginForm.css'
import { FaUser, FaEye, FaEyeSlash, FaEnvelope, FaPen, FaLock } from "react-icons/fa"

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

    return (
        <div className="login-body">
            <div className={`wrapper ${action}`}>
                <div className="form-box login">
                    <form action="">
                        <h1>Login</h1>
                        <div className="input-box">
                            <input type="text" placeholder="Username" required></input>
                            <FaUser className="icon"></FaUser>
                        </div>
                        <div className="input-box">
                            <input type={see ? "text" : "password"} placeholder="Password" required></input>
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
                    <form action="">
                        <h1>Registraion</h1>

                        <div className="input-box">
                            <input type="text" placeholder="Username" required></input>
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="text" placeholder="First name" required></input>
                            <FaPen className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="text" placeholder="Last name" required></input>
                            <FaPen className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="email" placeholder="Email" required></input>
                            <FaEnvelope className="icon" />
                        </div>
                        <div className="input-box">
                            {/* <input type="password" placeholder="Password" required></input>
                            <FaEyeSlash className="icon" /> */}
                            {/* <input type={see ? "text" : "password"} placeholder="Password" required></input> */}
                            <input
                                type={see ? "text" : "password"}
                                id="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {see ?
                                <FaEyeSlash className="icon" onClick={() => togglePassword()} />
                                : <FaEye className="icon" onClick={() => togglePassword()} />
                            }
                        </div>
                        <div className="input-box">
                            {/* <input type="password" placeholder="Confirm password" required></input>
                            <FaEyeSlash className="icon" /> */}
                            {/* <input type={see ? "text" : "password"} placeholder="Confirm password" required></input>
                            {see ?
                                <FaEyeSlash className="icon" onClick={() => togglePassword()} />
                                : <FaEye className="icon" onClick={() => togglePassword()} />
                            } */}
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

