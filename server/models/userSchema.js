const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: [
        {
            follower: {
                type: String,
                required: true,
            },
        },
    ],
    followings: [
        {
            following: {
                type: String,
                required: true,
            },
        },
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

//Bcrypt(hashing) password
//------------------------
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});
//Followings Storing function
//-------------------------
userSchema.methods.addFollowing = async function (following) {
    try {
        this.followings = this.followings.concat({ following });
        await this.following();
        return this.followings;
    } catch (error) {
        console.log(error);
    }
};
//Followers Storing function
//-------------------------
userSchema.methods.addFollower = async function (follower) {
    try {
        this.followers = this.followers.concat({ follower });
        await this.follower();
        return this.followers;
    } catch (error) {
        console.log(error);
    }
};

//Token Generation
//----------------
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
};
const User = mongoose.model("USER", userSchema);

module.exports = User;
