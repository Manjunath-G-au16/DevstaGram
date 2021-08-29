import React, { useState, useEffect } from 'react'
import Heading from '../Common/Heading/Heading';
import "./MyVideos.scss";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScaleLoader from "react-spinners/ScaleLoader";

const MyVideos = () => {
    const [videos, setVideos] = useState([])
    const [video, setVideo] = useState({})
    const [active, setActive] = useState()
    const [loading, setLoading] = useState(true)
    const history = useHistory();
    const fetchVideos = async () => {
        setActive(true)
        try {
            const res = await fetch("/myVideos", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);
            setVideos(data);
            setLoading(false);
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
        }
    };
    const fetchVideo = async (ID) => {
        setActive(false)
        setLoading(true)
        try {
            const res = await fetch(`/video/${ID}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            setVideo(data);
            setLoading(false)
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push("/myVideos");
        }
    }
    useEffect(() => {
        fetchVideos();
    }, [])
    return (
        <>
            <Heading heading="Videos" />
            {loading && <div className="loaderx"><ScaleLoader
                color={"#2b343b"} loading={loading} size={0} /></div>}
            {(active === true) ?
                <div className="video-home">
                    {videos.map((item, index) => {
                        return (
                            <div key={index} className="video-con" onClick={() => fetchVideo(item._id)}>
                                <div className="title">
                                    <h3>{item.title}</h3>
                                </div>
                                <div className="video">
                                    <video src={item.url}></video>
                                </div>
                            </div>
                        )
                    })
                    }
                </div> :
                <div className="onevideo">
                    <div className="video">
                        <video src={video.url} controls></video>
                    </div>
                </div>

            }
        </>
    )
}

export default MyVideos
