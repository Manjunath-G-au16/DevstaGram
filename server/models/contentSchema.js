const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contentBy: {
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
        default: "pending",
    },
    saveStatus: {
        type: String,
        default: "pending",
    },
    likes: [
        {
            likedBy: {
                type: String,
            },
        },
    ],
    saves: [
        {
            savedBy: {
                type: String,
            },
        },
    ],

});
//Likes Storing function
//-------------------------
contentSchema.methods.addLike = async function (likedBy) {
    try {
        this.likes = this.likes.concat({ likedBy });
        await this.save();
        return this.likes;
    } catch (error) {
        console.log(error);
    }
};
//Saves Storing function
//-------------------------
contentSchema.methods.addSave = async function (savedBy) {
    try {
        this.saves = this.saves.concat({ savedBy });
        await this.save();
        return this.saves;
    } catch (error) {
        console.log(error);
    }
};
const Content = mongoose.model("CONTENT", contentSchema);

module.exports = Content;
