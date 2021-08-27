import React, { useState, useEffect } from 'react'
import Heading from '../Common/Heading/Heading';
import "./VideoHome.scss";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScaleLoader from "react-spinners/ScaleLoader";

const VideoHome = () => {
    const [videos, setVideos] = useState([])
    const [video, setVideo] = useState({})
    const [user, setUser] = useState({})
    const [commId, setCommId] = useState("")
    const [replyId, setReplyId] = useState("")
    const [likeActive, setLikeActive] = useState(false)
    const [descActive, setDescActive] = useState(false)
    const [replyActive, setReplyActive] = useState(false)
    const [rID, setRID] = useState("")
    const [active, setActive] = useState()
    const [loading, setLoading] = useState(true)
    const [userComment, setUserComment] = useState("")
    const [userReply, setUserReply] = useState("")
    const [updateComment, setUpdateComment] = useState("")
    const [comments, setComments] = useState([])
    const [replys, setReplys] = useState([])
    const history = useHistory();
    let storeLikes = [];
    const handleDescToggle = () => {
        setDescActive(!descActive);
    }
    const handleReplyToggle = () => {
        setReplyActive(!replyActive);
    }
    const handleLike = () => {
        setLikeActive(!likeActive);
    }

    const fetchVideos = async () => {
        setActive(true)
        try {
            const res = await fetch("/contents", {
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
            // if (data.likes.filter(e => e['likedBy'] === 'modimanju2019@gmail.com').length > 0) {
            //     console.log("yyyyyyyyyyyyyyyyy");
            // }
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
        try {
            const res = await fetch(`/content/${ID}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            setVideo(data);
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push("/videoHome");
        }
    }
    const fetchComments = async (id) => {
        try {
            const res = await fetch(`/comments/${id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            setComments(data);
            console.log(data);
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push("/videoHome");
        }
    }
    const fetchReplys = async (id) => {
        try {
            const res = await fetch(`/replys/${id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            setReplys(data);
            setReplyId(id);
            console.log(data);
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push("/videoHome");
        }
    }
    const postComment = async () => {
        const videoID = video._id;
        const comment = userComment;
        const res = await fetch("/uploadComment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment,
                videoID
            }),
        });
        const data = await res.json();
        if (!data) {
            console.log("Comment not sent");
        } else {
            console.log("Comment sent");
            fetchComments(video._id);
        }
    };
    const postReply = async (id) => {
        const commentID = id;
        const reply = userReply;
        const res = await fetch("/uploadReply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reply,
                commentID
            }),
        });
        const data = await res.json();
        if (!data) {
            console.log("Reply not sent");
        } else {
            console.log("Reply sent");
            fetchReplys(id);
        }
    };
    const editComment = async (id) => {
        const comment = updateComment;
        const res = await fetch(`/editComment/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment,
            }),
        });
        const data = await res.json();
        if (!data) {
            console.log("Comment not sent");
        } else {
            console.log("Comment sent");
            fetchComments(video._id);
            setCommId("")
        }
    };
    const delComment = async (id) => {
        const res = await fetch(`/deleteComment/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();
        if (!data) {
            console.log("Comment not sent");
        } else {
            console.log("Comment sent");
            fetchComments(video._id);
        }
    };
    const delReply = async (id) => {
        const res = await fetch(`/deleteReply/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();
        if (!data) {
            console.log("Reply not sent");
        } else {
            console.log("Reply sent");
            fetchReplys(rID);
        }
    };
    const deleteLike = async (id) => {
        const res = await fetch(`/deleteLike/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();
        if (!data) {
            console.log("Like not sent");
        } else {
            console.log("Like sent");
            let newVideos = [...videos]
            newVideos.map(item => {
                if (item._id === id) {
                    item.likes.length = item.likes.length - 1;
                    item.status = "unliked"
                }
            })
            setVideos(newVideos)
        }
    };
    const authenticate = async () => {
        try {
            const res = await fetch("/authenticate", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);
            setUser(data)
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push("/");
        }
    };
    //sending data to backend
    const postLike = async (id) => {
        const _id = id
        const res = await fetch('/likes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id
            }),
        });
        const data = await res.json();
        if (res.status === 422 || !data) {
            toast.dark("Fill all the fields!");
        } else {
            // toast.dark("Post Liked");
            console.log("Post Liked");
            let newVideos = [...videos]
            newVideos.map(item => {
                if (item._id === id) {
                    item.likes.length = item.likes.length + 1;
                    item.status = "liked"
                }
            })
            setVideos(newVideos)
            console.log(newVideos);
        }
    };
    useEffect(() => {
        authenticate();
    }, [])
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
                            <div key={index} className="video-con">
                                <div className="title">
                                    <h3>{item.description}</h3>
                                </div>
                                <div className="video">
                                    <img src={item.url} alt="" />
                                </div>
                                <h5>{item.likes.length}</h5>
                                <button
                                    onClick={(item.likes.filter(e => e['likedBy'] === user.email).length > 0) || (item.status === "liked")
                                        ? () => deleteLike(item._id)
                                        : () => postLike(item._id)
                                    }>Like</button>
                            </div>
                        )
                    })
                    }
                </div> :
                <div className="onevideo">
                    <div className="btn">
                        <button onClick={() => setActive(true)}>Back</button>
                    </div>
                    <div className="video">
                        <video src={video.url} controls></video>
                    </div>
                    <div className="title">
                        <h3>{video.title}</h3>
                        <button onClick={handleDescToggle}>Description</button>
                    </div>
                    {(descActive === true) &&
                        <div className="desc">
                            <h5>{video.description}</h5>
                        </div>}
                    <div className="comment-sec">
                        <input type="text"
                            name="comment"
                            placeholder="Type your comment here..."
                            onChange={(e) => setUserComment(e.target.value)}
                            required
                        />
                        <button onClick={postComment}>Comment</button>
                    </div>
                    <div className="comments-sec">
                        {comments.slice(0).reverse().map((item, index) => {
                            return (
                                <div className="comments" key={index}>
                                    {(commId === item._id) ?
                                        <>
                                            <input type="text"
                                                name="comment"
                                                placeholder="Comment"
                                                defaultValue={item.comment}
                                                onChange={(e) => setUpdateComment(e.target.value)}
                                                required
                                            />
                                            <div className="btn">
                                                <button onClick={() => editComment(item._id)}>Update</button>
                                                <button onClick={() => setCommId("")}>Cancel</button>
                                            </div>
                                        </>
                                        :
                                        <div className="comment-details">
                                            <div className="user">
                                                <div className="user-logo">
                                                    <h3>{[...item.name].reverse().splice(-1)}</h3>
                                                    <div className="user-comment">
                                                        <h4>{item.name}</h4>
                                                        <h5>{item.comment}</h5>
                                                    </div>
                                                </div>
                                                {
                                                    user.email === item.email &&
                                                    <div className="btn">
                                                        <button onClick={() => setCommId(item._id)}>Edit</button>
                                                        <button onClick={() => delComment(item._id)}>Delete</button>
                                                    </div>
                                                }
                                            </div>
                                            <div className="reply-con">
                                                <div className="reply-sec">
                                                    <input type="text"
                                                        name="reply"
                                                        placeholder="Reply"
                                                        onChange={(e) => setUserReply(e.target.value)}
                                                        required
                                                    />
                                                    <div className="btnR">
                                                        <button onClick={() => postReply(item._id)}>Send</button>
                                                        <button onClick={() => { fetchReplys(item._id); setRID(item._id); handleReplyToggle() }}>Replies</button>
                                                    </div>
                                                </div>
                                                {(replyId === item._id && replyActive === true) &&
                                                    replys.slice(0).reverse().map((item, index) => {
                                                        return (
                                                            <div className="userR">
                                                                <div className="user-logo">
                                                                    <h4>{[...item.name].reverse().splice(-1)}</h4>
                                                                    <div className="user-comment">
                                                                        <h5>{item.name}</h5>
                                                                        <h6>{item.reply}</h6>
                                                                    </div>
                                                                </div>

                                                                <div className="btn">
                                                                    {/* <button onClick={() => setCommId(item._id)}>Edit</button> */}
                                                                    <button onClick={() => delReply(item._id)}>Delete</button>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </>
    )
}

export default VideoHome
