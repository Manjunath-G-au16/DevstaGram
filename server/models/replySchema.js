const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    commentID: {
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
    reply: {
        type: String,
        required: true
    }
});

const Reply = mongoose.model("REPLY", replySchema);

module.exports = Reply;
