const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    contentBy: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "approved",
    }
});

const Content = mongoose.model("CONTENT", contentSchema);

module.exports = Content;
