const express = require("express");
const commentRouter = express.Router();
require("../db/conn");
const Comment = require("../models/commentSchema");
const Authenticate = require("../middleware/authenticate");
commentRouter.use(express.json())

//Upload Comment 
//-----------------------------------------
commentRouter.post("/uploadComment", Authenticate, async (req, res) => {
    const name = req.rootUser.name
    const email = req.rootUser.email
    const { videoID, comment } = req.body;
    if (!comment) {
        return res.status(422).json({ Error: "plz fill the fields properly" });
    }
    try {
        const userComment = new Comment({ name, email, videoID, comment });
        await userComment.save();
        res.status(201).json({ message: "Comment uploaded successfully" });
    } catch (err) {
        res.status(500).send(err)
    }
});
//Display comments
//-----------------------------------------
commentRouter.get("/comments/:id", Authenticate, async (req, res) => {
    const id = req.params.id
    try {
        comments = await Comment.find({ videoID: id });
        res.status(200).send(comments);
    } catch (err) {
        res.status(500).send(err)
    }
});
//Edit Comment
//--------------------
commentRouter.put("/editComment/:id", Authenticate, async (req, res) => {
    const _id = req.params.id
    try {
        const comment = await Comment.findByIdAndUpdate(_id, req.body, {
            new: true
        })
        res.status(200).send(comment)
    } catch (err) {
        res.status(500).send(err)
    }
});
//Delete Comment
//--------------------
commentRouter.delete("/deleteComment/:id", Authenticate, async (req, res) => {
    try {
        const _id = req.params.id
        const comment = await Comment.findByIdAndDelete(_id)
        res.status(200).json({ message: "Comment deleted successfully" })
    } catch (err) {
        res.status(500).send(err)
    }
});

module.exports = commentRouter;