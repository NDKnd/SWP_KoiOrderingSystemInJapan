import React from "react";
import './Header.css';
import { FaHome, FaAngleDown } from 'react-icons/fa'
import { Link } from "react-router-dom";

function Header() {

    // const dropdowns = document.querySelector('.dropdown last');
    // const dropConts = document.querySelector('.drop-conts last');

    // const outOfPage = dropConts.getBoundingClientRect().y < 0;
    // dropdowns.style.position = 'absolute';
    // if (outOfPage) {
    //     dropdowns.style.top = '3em';
    //     dropdowns.style.left = '0';
    // } else {
    //     dropdowns.style.top = '3em';
    //     dropdowns.style.left = '0';
    // }


    return (
        <div className="navbar">
            <div className="nav-item">
                <Link to="/" style={{ textDecoration: 'none' }}><FaHome /></Link>
            </div>
            <div className="nav-item">
                <p className="title" >Title</p><FaAngleDown />
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
                        <li className="opt">
                            <Link to="/login" style={{ textDecoration: 'none' }}>Login</Link>
                        </li>
                        <li className="opt">Opt2</li>
                        <li className="opt">Opt3</li>
                    </div>
                </ul>
            </div>
            <div className="nav-item">
                <p className="title">Title</p><FaAngleDown />
                <ul className="dropdown last">
                    <div className="drop-conts last">
                        <li className="opt">Opt1</li>
                        <li className="opt">Opt2</li>
                        <li className="opt">Opt3</li>
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default Header;