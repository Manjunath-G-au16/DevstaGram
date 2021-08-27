const express = require("express");
const replyRouter = express.Router();
require("../db/conn");
const Reply = require("../models/replySchema");
const Authenticate = require("../middleware/authenticate");
replyRouter.use(express.json())

//Upload Reply 
//-----------------------------------------
replyRouter.post("/uploadReply", Authenticate, async (req, res) => {
    const name = req.rootUser.name
    const email = req.rootUser.email
    const { commentID, reply } = req.body;
    if (!reply) {
        return res.status(422).json({ Error: "plz fill the fields properly" });
    }
    try {
        const userReply = new Reply({ name, email, commentID, reply });
        await userReply.save();
        res.status(201).json({ message: "Reply uploaded successfully" });
    } catch (err) {
        res.status(500).send(err)
    }
});
//Display replys
//-----------------------------------------
replyRouter.get("/replys/:id", Authenticate, async (req, res) => {
    const id = req.params.id
    try {
        replys = await Reply.find({ commentID: id });
        res.status(200).send(replys);
    } catch (err) {
        res.status(500).send(err)
    }
});
//Edit Reply
//--------------------
replyRouter.put("/editReply/:id", Authenticate, async (req, res) => {
    const _id = req.params.id
    try {
        const reply = await Reply.findByIdAndUpdate(_id, req.body, {
            new: true
        })
        res.status(200).send(reply)
    } catch (err) {
        res.status(500).send(err)
    }
});
//Delete Reply
//--------------------
replyRouter.delete("/deleteReply/:id", Authenticate, async (req, res) => {
    try {
        const _id = req.params.id
        const reply = await Reply.findByIdAndDelete(_id)
        res.status(200).json({ message: "Reply deleted successfully" })
    } catch (err) {
        res.status(500).send(err)
    }
});

module.exports = replyRouter;