import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Heading from '../Heading/Heading';
import "./Profile.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import Modal from "react-modal";

const Profile = () => {

    const [user, setUser] = useState({
        name: "",
        phone: "",
        bio: "",
        website: "",
    })
    const [posts, setPosts] = useState([])
    const [userFollowers, setUserFollowers] = useState([])
    const [userFollowings, setUserFollowings] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingImg, setLoadingImg] = useState(true)
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [img, setImg] = useState("")
    const [prevImg, setPrevImg] = useState("")
    const [pic, setPic] = useState("")
    const history = useHistory();
    const authenticate = async () => {
        setLoading(true)
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
            console.log(data.followers);
            setUser(data);
            // setPrevImg(data.profilePic)
            setPic(data.profilePic)
            setLoadingImg(false)
            setUserFollowers(data.followers)
            setUserFollowings(data.followings)
            setLoading(false)
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push("/");
        }
    };
    const fetchPosts = async () => {
        try {
            const res = await fetch("/myContents", {
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
            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handleImg = (e) => {
        setImg(e.target.files[0]);
    }
    useEffect(() => {
        (img !== "") &&
            changeImg()

    }, [img])

    const handleInputs = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUser({ ...user, [name]: value });
    };
    const changeImg = () => {
        setLoadingImg(true)
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", "merndev");
        data.append("cloud_name", "modimanju");
        fetch("https://api.cloudinary.com/v1_1/modimanju/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.secure_url);
                setPic(data.secure_url);
                setLoadingImg(false)
            })
            .catch((err) => {
                console.log(err);
            });
        console.log("pic:", pic);
    }
    const postEdit = async (ID) => {
        const { name, phone, website, bio } = user;
        const profilePic = pic
        const res = await fetch(`/editUser/${ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                phone,
                website,
                bio,
                profilePic
            }),
        });
        const data = await res.json();
        if (res.status === 422 || !data) {
            toast.dark("Fill all the fields!");
        } else {
            toast.dark("Updated");
            setModalIsOpen(false);
            authenticate();
        }
    }

    useEffect(() => {
        authenticate();
        fetchPosts();
    }, [])
    return (
        <>
            <Heading heading={"Profile"} />
            {loading && <div className="loaderx"><ScaleLoader
                color={"#2b343b"} loading={loading} size={0} /></div>}
            <div className="profile-container">
                <div className="profile-img">
                    <div className="img">
                        <img src={user.profilePic} alt="" />
                    </div>
                </div>
                <div className="profile-cnt">
                    <div className="name-sec">
                        <h2>{user.name}</h2>
                        <div className="btn">
                            <button onClick={() => setModalIsOpen(true)}>Edit Profile</button>
                        </div>
                    </div>
                    <div className="followers-sec">
                        <h4><span>{posts.length}</span> {(posts.length === 1) ? "post" : "posts"}</h4>
                        <h4><span>{userFollowers.length}</span> {(userFollowers.length === 1) ? "follower" : "followers"}</h4>
                        <h4><span>{userFollowings.length}</span> {(userFollowings.length === 1) ? "following" : "followings"}</h4>
                    </div>
                    <div className="bio-sec">
                        <h4>{user.bio}</h4>
                    </div>
                    <div className="contact-sec">
                        <button><a href={user.website} target="_blank">Website</a></button>
                        <button><a href={`mailto: ${user.email}`}>Email</a></button>
                        <button><a href={`tel:+${user.phone}`}>Phone</a></button>
                    </div>
                </div>
            </div>
            <div className="post-container">
                {posts.map((item, index) => {
                    return (
                        <div className="post-sec">
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
            <Modal
                isOpen={modalIsOpen}
                className="Modal"
                overlayClassName="Overlay"
                ariaHideApp={false}
            >
                <div className="edit-con">
                    <div className="mclose-btn">
                        <button onClick={() => setModalIsOpen(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="img-sec">
                        <div className="img">
                            <img src={(pic === "") ? prevImg : pic} alt="" ></img>
                        </div>
                        <div className="img-upload">
                            {loadingImg ? <div className="loader">
                                <ScaleLoader color={"#fff"} loading={loadingImg} />
                            </div> : <>
                                <input type="file" name="image" id="image" accept="image/*" onChange={handleImg} />
                                <label htmlFor="image">
                                    <h1>Change</h1>
                                </label>
                            </>}
                        </div>

                    </div>
                    <div className="cnt-sec">
                        <div className="inputs">
                            <div className="input name">
                                <label htmlFor="name">Name :</label>
                                <input type="text" value={user.name} name="name" id="name" onChange={handleInputs} />
                            </div>
                            <div className="input phone">
                                <label htmlFor="name">Phone :</label>
                                <input type="number" value={user.phone} name="phone" id="phone" onChange={handleInputs} />
                            </div>
                            <div className="input website">
                                <label htmlFor="name">Website :</label>
                                <input type="text" value={user.website} name="website" id="website" onChange={handleInputs} />
                            </div>
                            <div className="input bio">
                                <label htmlFor="name">Bio :</label>
                                <textarea name="bio" value={user.bio} id="bio" onChange={handleInputs}></textarea>
                            </div>
                            <div className="btn">
                                <button onClick={() => postEdit(user._id)}>update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

        </>
    )
}

export default Profile
