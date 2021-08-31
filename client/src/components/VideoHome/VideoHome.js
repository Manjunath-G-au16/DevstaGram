import React, { useState, useEffect } from 'react'
import Heading from '../Common/Heading/Heading';
import "./VideoHome.scss";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScaleLoader from "react-spinners/ScaleLoader";

const VideoHome = () => {
    const [videos, setVideos] = useState([])
    const [more, setMore] = useState([])
    const [deleteActive, setDeleteActive] = useState([])
    const [video, setVideo] = useState({})
    const [user, setUser] = useState({})
    const [commId, setCommId] = useState("")
    const [replyId, setReplyId] = useState("")
    const [likeActive, setLikeActive] = useState(false)
    const [descActive, setDescActive] = useState(false)
    const [replyActive, setReplyActive] = useState(false)
    const [followStatus, setFollowStatus] = useState(false)
    const [toolTip, setToolTip] = useState(false)
    const [toolTipDel, setToolTipDel] = useState(false)
    const [rID, setRID] = useState("")
    const [active, setActive] = useState(true)
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
    const handleMore = (id) => {
        let newMore = [...more]
        newMore.push(id)
        setMore(newMore)
    }
    const handleDeleteActive = (id) => {
        setToolTipDel(!toolTipDel)
        if (toolTipDel === true) {
            let newDeleteActive = [...deleteActive]
            newDeleteActive.push(id)
            setDeleteActive(newDeleteActive)
        } else {
            let newDeleteActive = [...deleteActive]
            newDeleteActive.pop(id)
            setDeleteActive(newDeleteActive)
        }
    }


    const fetchVideos = async () => {
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
            setLoading(false)
            fetchComments(ID)
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
            else {
                console.log("data", data);
                if (user.followings.filter(e => e['following'] === data.contentBy).length > 0) {
                    setFollowStatus(true)
                }
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
            setUserComment("")
            fetchComments(video._id);
        }
    };
    const postFollower = async () => {
        const email = video.contentBy;
        const res = await fetch("/followers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email
            }),
        });
        const data = await res.json();
        if (!data) {
            console.log("Not Followed");
        } else {
            console.log("Followed successfully");
            setFollowStatus(true)
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
    const delFollower = async (id) => {
        const res = await fetch(`/deleteFollower/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();
        if (!data) {
            console.log("Unfollowed Unsuccessful");
        } else {
            console.log("Unfollowed successfully");
            setFollowStatus(false)
            user.followings.length = 0;
            setToolTip(false);
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
    const deleteSave = async (id) => {
        const res = await fetch(`/deleteSave/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await res.json();
        if (!data) {
            console.log("Save not sent");
        } else {
            console.log("Post Unsaved");
            let newVideos = [...videos]
            newVideos.map(item => {
                if (item._id === id) {
                    item.saves.length = item.saves.length - 1;
                    item.saveStatus = "unsaved"
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
    const postSave = async (id) => {
        const _id = id
        const res = await fetch('/saves', {
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
            // toast.dark("Post Saved");
            console.log("Post Saved");
            let newVideos = [...videos]
            newVideos.map(item => {
                if (item._id === id) {
                    item.saves.length = item.saves.length + 1;
                    item.saveStatus = "saved"
                }
            })
            setVideos(newVideos)
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
                <div className="content-home">
                    {videos.map((item, index) => {
                        return (
                            <div key={index} className="video-con">
                                <div className="title">

                                    <div className="title-img">
                                        <img src={item.profilePic} alt="" />
                                    </div>
                                    <h3>{item.name}</h3>
                                </div>
                                <div className="video">
                                    <img src={item.url} alt="" />
                                </div>
                                <div className="btn-sec">
                                    <div className="sec1">
                                        <div className="like-btn">
                                            <i className={(item.likes.filter(e => e['likedBy'] === user.email).length > 0) || (item.status === "liked") ?
                                                "fas fa-heart liked" : "fas fa-heart unliked"}
                                                onClick={(item.likes.filter(e => e['likedBy'] === user.email).length > 0) || (item.status === "liked")
                                                    ? () => deleteLike(item._id)
                                                    : () => postLike(item._id)
                                                }>
                                            </i>
                                        </div>
                                        <div className="comment-btn">
                                            <i className="far fa-comment" onClick={() => { fetchVideo(item._id); }}></i>
                                        </div>
                                    </div>
                                    <div className="sec2">
                                        <i className={(item.saves.filter(e => e['savedBy'] === user.email).length > 0) || (item.saveStatus === "saved") ?
                                            "fas fa-bookmark saved" : "fas fa-bookmark unsaved"}
                                            onClick={(item.saves.filter(e => e['savedBy'] === user.email).length > 0) || (item.saveStatus === "saved")
                                                ? () => deleteSave(item._id)
                                                : () => postSave(item._id)
                                            }></i>
                                    </div>
                                </div>
                                <h5>{item.likes.length} {(item.likes.length === 1) ? "like" : "likes"} </h5>
                                <div className="cnt-sec">
                                    <h5 className={(more.includes(item._id) === true) && "more"}>{item.name} <span>{item.description}</span></h5>
                                    <h6 onClick={() => handleMore(item._id)}>{(more.includes(item._id) === true) ? "" : "more"}</h6>
                                </div>
                            </div>
                        )
                    })
                    }
                </div> :
                <div className="onepost">
                    <div className="btn">
                        <button onClick={() => setActive(true)}>Back</button>
                    </div>
                    <div className="sec">
                        <div className="sec-video">
                            <img src={video.url} alt="" />
                        </div>
                        <div className="sec-cnt">
                            <div className="sec-details">
                                <div className="title">
                                    <h4>
                                        <div className="title-img">
                                            <img src={video.profilePic} alt="" />
                                        </div>
                                        {video.name}
                                        {(followStatus === true) ?
                                            <>
                                                <span>Following</span>
                                                <i className="fas fa-ellipsis-v" onClick={() => setToolTip(!toolTip)}>
                                                    {(toolTip === true) && <h5 onClick={() => delFollower(video.contentBy)}>UnFollow</h5>}
                                                </i>
                                            </> :
                                            <span onClick={postFollower}>Follow &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        }
                                    </h4>
                                </div>

                                <div className="cnt-details">

                                    <div className="cnt-sec">
                                        <h5 className="more">
                                            <div className="cnt-img">
                                                <img src={video.profilePic} alt="" />
                                            </div>
                                            <div className="cnt-txt">
                                                {video.name} <span>{video.description}</span>
                                            </div>
                                        </h5>
                                    </div>
                                    {comments.slice(0).reverse().map((item, index) => {
                                        return (
                                            <div className="cmt" key={index}>
                                                <h4><div className="cmt-img"><img src={item.profilePic} alt="" /></div></h4>
                                                <h5>{item.name} <span>
                                                    {item.comment}</span></h5>
                                                <i className="fas fa-ellipsis-v" onClick={() => handleDeleteActive(item._id)}>
                                                    {(deleteActive.includes(item._id) === true) && <h5 onClick={() => delComment(item._id)}>Delete</h5>}
                                                </i>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="comment-sec">
                                <input type="text"
                                    name="comment"
                                    value={userComment}
                                    placeholder="Type your comment here..."
                                    onChange={(e) => setUserComment(e.target.value)}
                                    required
                                />
                                <button disabled={userComment.length < 1} onClick={postComment}>Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default VideoHome
