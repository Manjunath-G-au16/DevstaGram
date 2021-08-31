import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Heading from '../Heading/Heading';
import "./Profile.scss";

const Profile = () => {
    const [user, setUser] = useState({})
    const [userFollowers, setUserFollowers] = useState([])
    const [userFollowings, setUserFollowings] = useState([])
    const history = useHistory();
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
            console.log(data.followers);
            setUser(data);
            setUserFollowers(data.followers)
            setUserFollowings(data.followings)

            if (!res.status === 200) {
                const error = new Error(res.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push("/");
        }
    };
    useEffect(() => {
        authenticate();
    }, [])
    return (
        <>
            <Heading heading={"Profile"} />
            <div className="profile-container">
                <div className="profile-img">
                    <div className="img">
                        <img src={user.pic} alt="" />
                    </div>
                </div>
                <div className="profile-cnt">
                    <div className="name-sec">
                        <h2>{user.name}</h2>
                        <div className="btn">
                            <button>Edit Profile</button>
                        </div>
                    </div>
                    <div className="followers-sec">
                        <h4><span>10</span> posts</h4>
                        <h4><span>{userFollowers.length}</span> {(userFollowers.length === 1) ? "follower" : "followers"}</h4>
                        <h4><span>{userFollowings.length}</span> {(userFollowings.length === 1) ? "following" : "followings"}</h4>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
