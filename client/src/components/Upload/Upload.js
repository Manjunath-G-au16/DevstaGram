import React, { useEffect, useState } from 'react';
import Heading from '../Common/Heading/Heading';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Upload.scss";
import { useHistory } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";

const UploadVideo = () => {
    const [titl, setTitl] = useState("")
    const [desc, setDesc] = useState("")
    const [image, setImage] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [video, setVideo] = useState("")
    const [videoUrl, setVideoUrl] = useState("")
    const [loadingVideo, setLoadingVideo] = useState(false)
    const [loadingImage, setLoadingImage] = useState(false)
    const history = useHistory();
    const postContent = async () => {
        const description = desc;
        const url = imageUrl;
        const res = await fetch("/uploadContent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description,
                url
            }),
        });
        const data = await res.json();

        if (res.status === 422 || !data) {
            toast.dark("Plz fill the fields");
        } else {
            toast.dark("Uploaded successfully");
        }
        history.push("/uploadVideo");
    };

    const handleVideo = (e) => {
        if (e.target.files[0].type.includes("video")) {
            setVideo(e.target.files[0]);
            console.log(e.target.files[0]);
        }
        else {
            toast.dark("Invalid File Type");
        }
    }
    const handleImage = (e) => {
        if (e.target.files[0].type.includes("image")) {
            setImage(e.target.files[0]);
            console.log(e.target.files[0]);
        }
        else {
            toast.dark("Invalid File Type");
        }
    }
    useEffect(() => {
        (video !== "") &&
            uploadVideo();
    }, [video])

    useEffect(() => {
        (image !== "") &&
            uploadImage();
    }, [image])

    const uploadVideo = () => {
        setLoadingVideo(true);
        const data = new FormData();
        data.append("file", video);
        data.append("upload_preset", "merndev");
        data.append("cloud_name", "modimanju");
        fetch("https://api.cloudinary.com/v1_1/modimanju/video/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.secure_url);
                setVideoUrl(data.secure_url);
                setLoadingVideo(false)
            })
            .catch((err) => {
                console.log(err);
            });

        console.log("videoUrl:", videoUrl);
    }
    const uploadImage = () => {
        setLoadingImage(true);
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "merndev");
        data.append("cloud_name", "modimanju");
        fetch("https://api.cloudinary.com/v1_1/modimanju/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.secure_url);
                setImageUrl(data.secure_url);
                setLoadingImage(false)
            })
            .catch((err) => {
                console.log(err);
            });

        console.log("imageUrl:", imageUrl);
    }
    // const authenticate = async () => {
    //     try {
    //         const res = await fetch("/myDoubts", {
    //             method: "GET",
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json",
    //             },
    //             credentials: "include",
    //         });
    //         const data = await res.json();
    //         console.log(data);
    //         if (!res.status === 200) {
    //             const error = new Error(res.error);
    //             throw error;
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         history.push("/");
    //     }
    // };
    // useEffect(() => {
    //     authenticate();
    // }, [])
    return (
        <>
            <Heading heading="Upload Post" />
            <div className="uploadvideo-sec">
                <div className="uploadvideo-con">
                    <div className="image">
                        <input type="file" name="image" id="image" accept="image/*" onChange={handleImage} />
                        {loadingImage ? <div className="loader">
                            <ScaleLoader color={"#2b343b"} loading={loadingImage} />
                            Uploading...!
                        </div> : <>
                            <img src={imageUrl} alt="" />
                            <label htmlFor="image">
                                <i className="fas fa-cloud-upload-alt"></i>
                                <h2>Upload Image</h2>
                            </label>
                        </>
                        }
                    </div>
                    <div className="textarea">
                        <textarea className="description" name="description" placeholder="Description..." onChange={(e) => setDesc(e.target.value)} required></textarea>
                    </div>
                </div>
                <div className="btn">
                    <button onClick={postContent}>upload</button>
                </div>
            </div>

            <ToastContainer position="top-right" />
        </>
    )
}

export default UploadVideo
