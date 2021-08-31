import React, { useEffect } from 'react';
import "./Sidebar.scss";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    useEffect(() => {
        const list = document.querySelectorAll('.list');
        function activeLink() {
            list.forEach((item) =>
                item.classList.remove('active'));
            this.classList.add('active');
        }
        list.forEach((item) =>
            item.addEventListener('click', activeLink));
    }, [])
    return (
        <div className="nav">
            <div className="navigation">
                <div className="logo">
                    <i className="fab fa-instagram"></i>
                    <h2>DevstaGram</h2>
                </div>
                <ul>
                    <li className="list active">
                        <NavLink className="nav-link" to="/videos">
                            <span className="icon">
                                <i className="fas fa-clone"></i>
                            </span>
                            <span className="title">Posts</span>
                        </NavLink>
                    </li>
                    <li className="list">
                        <NavLink className="nav-link" to="/uploadVideo">
                            <span className="icon">
                                <i className="fas fa-file-upload"></i>
                            </span>
                            <span className="title">Upload Post</span>
                        </NavLink>
                    </li>
                    <li className="list">
                        <NavLink className="nav-link" to="/profile">
                            <span className="icon">
                                <i className="fas fa-address-card"></i>
                            </span>
                            <span className="title">Profile</span>
                        </NavLink>
                    </li>
                    <li className="list">
                        <NavLink className="nav-link" to="/myVideos">
                            <span className="icon">
                                <i className="fas fa-bookmark"></i>
                            </span>
                            <span className="title">Saved Posts</span>
                        </NavLink>
                    </li>
                    <li className="list">
                        <NavLink className="nav-link" to="/logout">
                            <span className="icon">
                                <i className="fas fa-sign-out-alt"></i>
                            </span>
                            <span className="title">Logout</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
