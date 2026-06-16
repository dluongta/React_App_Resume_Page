import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import DevicesIcon from '@mui/icons-material/Devices';
import GridViewIcon from '@mui/icons-material/GridView';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../../assets/luen-1.jpg';

export const Header = () => {
    const [sideBar, setSidebar] = useState(false);
    const location = useLocation();
    const navRef = useRef(null);

    // Scroll effect
    // useEffect(() => {
    //     const handleScroll = () => {
    //         const header = document.querySelector(".header");
    //         header.classList.toggle("active", window.scrollY > 200);
    //     };
    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, []);

    // Close sidebar when click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setSidebar(false);
            }
        };

        if (sideBar) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sideBar]);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <div className="top-marquee">
                <div className="marquee-content">
                    <span>Welcome To React App Resume Page</span>
                </div>
            </div>
            <header className="header">
                <div className="container flex">
                    <div className="logo">
                        <Link to="/">
                            <img width="95" height="60" src={logo} alt="logo" />
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="nav desktop-nav">
                        <ul className="nav-links">
                            <li className={isActive('/') ? 'active-link' : ''}><Link to="/">Home</Link></li>
                            <li className={isActive('/web') ? 'active-link' : ''}><Link to="/web">Web</Link></li>
                            <li className={isActive('/mobile') ? 'active-link' : ''}><Link to="/mobile">Mobile</Link></li>
                            <li className={isActive('/app') ? 'active-link' : ''}><Link to="/app">App</Link></li>
                            <li className={isActive('/resume') ? 'active-link' : ''}><Link to="/resume">Resume</Link></li>
                            {/* <li className={isActive('/galaxy') ? 'active-link' : ''}><Link to="/galaxy">Galaxy</Link></li> */}
                            {/* <li className="icon">
                                <SearchIcon className="HeaderIcon" />
                                <DevicesIcon className="HeaderIcon" />
                                <GridViewIcon className="HeaderIcon" />
                            </li> */}
                        </ul>
                    </div>

                    {/* Mobile button */}
                    <button className="nav-items-icon" onClick={() => setSidebar(!sideBar)}>
                        {sideBar ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </header>


            <div className={`mobile-overlay ${sideBar ? "show" : ""}`}>
                <div className="overlay-bg" onClick={() => setSidebar(false)} />

                <div className={`mobile-sidebar ${sideBar ? "open" : ""}`} ref={navRef}>
                    <button className="close-sidebar-btn" onClick={() => setSidebar(false)}>
                        <CloseIcon fontSize="large" />
                    </button>

                    <ul className="nav-links-sidebar" onClick={() => setSidebar(false)}>
                        <li className={isActive('/') ? 'active-link' : ''}><Link to="/">Home</Link></li>
                        <li className={isActive('/web') ? 'active-link' : ''}><Link to="/web">Web</Link></li>
                        <li className={isActive('/mobile') ? 'active-link' : ''}><Link to="/mobile">Mobile</Link></li>
                        <li className={isActive('/app') ? 'active-link' : ''}><Link to="/app">App</Link></li>
                        <li className={isActive('/resume') ? 'active-link' : ''}><Link to="/resume">Resume</Link></li>
                        {/* <li className={isActive('/galaxy') ? 'active-link' : ''}><Link to="/galaxy">Galaxy</Link></li> */}
                    </ul>
                </div>
            </div>

        </>
    );
};
