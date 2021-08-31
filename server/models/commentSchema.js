const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    videoID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    }
});

const Comment = mongoose.model("COMMENT", commentSchema);

module.exports = Comment;
