import React, { useState, useEffect } from 'react'
import Heading from '../Common/Heading/Heading';
import "./MyVideos.scss";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScaleLoader from "react-spinners/ScaleLoader";

const MyVideos = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const history = useHistory();
    const fetchPosts = async () => {
        setLoading(true)
        try {
            const res = await fetch("/postsSaved", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);
            setPosts(data);
            setLoading(false)
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [])
    return (
        <>
            <Heading heading="Saved Posts" />
            {loading && <div className="loaderx"><ScaleLoader
                color={"#2b343b"} loading={loading} size={0} /></div>}
            <div className="post-container">
                {posts.map((item, index) => {
                    return (
                        <div className="post-sec" key={index}>
                            <img src={item.url} alt="" />
                            <div className="details-sec">
                                <h3>
                                    {item.likes.length}
                                    <i className="fas fa-heart"></i>
                                </h3>
                                <h3>
                                    {item.saves.length}
                                    <i className="fas fa-bookmark"></i>
                                </h3>
                            </div>
                        </div>
                    )
                })}
            </div>


        </>
    )
}

export default MyVideos
