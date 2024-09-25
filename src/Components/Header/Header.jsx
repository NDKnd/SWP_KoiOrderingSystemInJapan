import React, {useEffect} from "react";
import './Header.css';
import { FaHome, FaAngleDown } from 'react-icons/fa'
import { NavLink, RouterProvider } from "react-router-dom";

function Header() {

    const token = localStorage.getItem('token');

    
    const activeNav = () => {
        const pageActive = document.querySelector('.active');
        const parent = pageActive.parentElement;
        if(parent === null) return;
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
            <div className="nav-item">
                <p className="title">
                    Title
                </p><FaAngleDown />
                <ul className="dropdown last">
                    <div className="drop-conts last">
                        <li className="opt">
                            <NavLink to="/login" >Login</NavLink>
                        </li>
                        <li className="opt">Opt2</li>
                        <li className="opt">Opt3</li>
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default Header;