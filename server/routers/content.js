const express = require("express");
const contentRouter = express.Router();
require("../db/conn");
const Content = require("../models/contentSchema");
const Authenticate = require("../middleware/authenticate");
contentRouter.use(express.json())

//Display Contents 
//-----------------------------------------
contentRouter.get("/contents", Authenticate, async (req, res) => {
    try {
        contents = await Content.find({ status: "pending" });
        res.status(200).send(contents);
    } catch (err) {
        res.status(500).send(err)
    }
});

//Display content by ID 
//-----------------------------------------
contentRouter.get("/content/:id", Authenticate, async (req, res) => {
    try {
        const _id = req.params.id
        content = await Content.findOne({ _id: _id });
        res.status(200).send(content);
    } catch (err) {
        res.status(500).send(err)
    }
});

//Display My Contents 
//-----------------------------------------
contentRouter.get("/myContents", Authenticate, async (req, res) => {
    const contentBy = req.rootUser.email
    try {
        contents = await Content.find({ contentBy: contentBy });
        res.status(200).send(contents);
    } catch (err) {
        res.status(500).send(err)
    }
});

//Upload Content 
//-----------------------------------------
contentRouter.post("/uploadContent", Authenticate, async (req, res) => {
    const name = req.rootUser.name
    const contentBy = req.rootUser.email
    const { description, url } = req.body;
    if (!description || !url) {
        return res.status(422).json({ Error: "plz fill the fields properly" });
    }
    try {
        const content = new Content({ name, contentBy, description, url });
        await content.save();
        res.status(201).json({ message: "Content uploaded successfully" });
    } catch (err) {
        res.status(500).send(err)
    }
});

//Edit Content
//--------------------
contentRouter.put("/editContent/:id", Authenticate, async (req, res) => {
    try {
        const _id = req.params.id
        const content = await Content.findByIdAndUpdate(_id, req.body, {
            new: true
        })
        res.status(200).send(content)
    } catch (err) {
        res.status(500).send(err)
    }
});

//Delete Content
//--------------------
contentRouter.delete("/deleteContent/:id", Authenticate, async (req, res) => {
    try {
        const _id = req.params.id
        const content = await Content.findByIdAndDelete(_id)
        res.status(200).json({ message: "Content deleted successfully" })
    } catch (err) {
        res.status(500).send(err)
    }
});

//Comment Content
//--------------------
contentRouter.post("/comment/:id", Authenticate, async (req, res) => {
    const _id = req.params.id
    const commentBy = req.rootUser.email
    try {
        const { comment } = req.body;
        if (!comment) {
            console.log("Plz fill the comment section");
            return res.json({ error: "plz fill the comment section" });
        }
        const userComment = await Content.findOne({ _id: _id });

        if (userComment) {
            const userCommentDetails = await userComment.addComment(
                comment,
                commentBy,
            );
            await userComment.save();
            res.status(201).json({ message: "User comment  sent successfully" });
        }
    } catch (error) {
        console.log(error);
    }
});
//Likes Section
//--------------------
contentRouter.post("/likes", Authenticate, async (req, res) => {
    try {
        const { _id } = req.body;
        const likedBy = req.rootUser.email
        const userLikes = await Content.findOne({ _id: _id });
        if (userLikes) {
            console.log(likedBy);
            const userLikesm = await userLikes.addLike(
                likedBy
            );
            await userLikes.save();
            res.status(201).json({ message: "User likes data sent successfully" });
        }
    } catch (error) {
        console.log(error);
    }
});
//Delete Like
//--------------------
contentRouter.delete("/deleteLike/:id", Authenticate, async (req, res) => {
    try {
        const _id = req.params.id
        const likedBy = req.rootUser.email
        const rootUser = await Content.updateOne(
            { '_id': _id },
            { $pull: { likes: { likedBy: likedBy } } });
        res.status(200).json({ message: "Content deleted successfully" })
    } catch (err) {
        res.status(500).send(err)
    }
});
module.exports = contentRouter;