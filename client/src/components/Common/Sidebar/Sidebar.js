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
                    <i className="fas fa-chalkboard-teacher"></i>
                    <h2>DevTube</h2>
                </div>
                <ul>
                    <li className="list active">
                        <NavLink className="nav-link" to="/videos">
                            <span className="icon">
                                <i className="fas fa-question-circle"></i>
                            </span>
                            <span className="title">Videos</span>
                        </NavLink>
                    </li>
                    <li className="list">
                        <NavLink className="nav-link" to="/uploadVideo">
                            <span className="icon">
                                <i className="fas fa-question-circle"></i></span>
                            <span className="title">Upload Video</span>
                        </NavLink>
                    </li>
                    <li className="list">
                        <NavLink className="nav-link" to="/myVideos">
                            <span className="icon">
                                <i className="fas fa-question-circle"></i></span>
                            <span className="title">My Videos</span>
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
