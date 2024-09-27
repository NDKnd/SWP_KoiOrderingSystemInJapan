import React, { useEffect } from "react";
import {Avatar} from 'antd';
import './Header.css';
import { FaHome, FaAngleDown } from 'react-icons/fa'
import { NavLink} from "react-router-dom";

function Header() {
    //for getting user token
    const token = localStorage.getItem('token');
           
    const handleLogout = () => {
        // Xoá token khỏi localStorage
        localStorage.removeItem('token');
        // Điều hướng người dùng về trang đăng nhập
        navigate('/login');
    };

    const activeNav = () => {
        const pageActive = document.querySelector('.active');
        const parent = pageActive.parentElement;
        if (parent === null) return;
        parent.style.backgroundColor = 'rgba(137, 43, 226, 0.174)';
        let newDiv = document.createElement('div');
        newDiv.style.transition = '0.3s inline';
        newDiv.style.position = 'absolute';
        newDiv.style.bottom = '0';
        newDiv.style.width = '100%';
        newDiv.style.height = '0.1em';
        newDiv.style.backgroundColor = 'rgba(137, 43, 226)';
        parent.appendChild(newDiv);
    };

    useEffect(() => {
        activeNav();
    }, []);

    return (
        <div className="navbar">
            <div className="nav-item">
                <NavLink to="/"><FaHome /></NavLink>
            </div>
            <div className="nav-item">
                <p className="title" >Services</p><FaAngleDown />
                <ul className="dropdown" >
                    <div className="drop-conts">
                        <li className="opt">Opt1</li>
                        <li className="opt">Opt2</li>
                        <li className="opt">Opt3</li>
                        <li className="opt">Opt4</li>
                        <li className="opt">Opt5</li>
                    </div>
                </ul>
            </div>
            <div className="nav-item">
                <p className="title">Title</p><FaAngleDown />
                <ul className="dropdown">
                    <div className="drop-conts">
                        <li className="opt">Opt1</li>
                        <li className="opt">Opt2</li>
                        <li className="opt">Opt3</li>
                    </div>
                </ul>
            </div>
            {
                !token ? (
                    <div className="nav-item">
                        <p className="title">
                            Join Us
                        </p><FaAngleDown />
                        <ul className="dropdown last">
                            <div className="drop-conts last">
                                <li className="opt">
                                    <NavLink to="/login" >Login</NavLink>
                                </li>
                                <li className="opt">
                                    <NavLink to="/register" >Register</NavLink>
                                </li>
                            </div>
                        </ul>
                    </div>

                ) : (
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
                                    <NavLink to="/profile" >Profile</NavLink>
                                </li>
                                <li className="opt">
                                    <NavLink to="/account-setting" >Settings</NavLink>
                                </li>
                                <li className="opt">
                                    <NavLink onClick={() => localStorage.clear()} >Logout</NavLink>
                                </li>
                            </div>
                        </ul>
                    </div>
                )
            }
        </div>
    );
}

export default Header;