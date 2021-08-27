const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
require("../db/conn");
const User = require("../models/userSchema");
const Authenticate = require("../middleware/authenticate");
userRouter.use(express.json())


userRouter.get("/", (req, res) => {
    res.send("Hello Server from userRouter");
});

//User Registration
//-----------------------------------------
userRouter.post("/signup", async (req, res) => {
    const { name, email, password, cpassword } = req.body;
    if (!name || !email || !password || !cpassword) {
        return res.status(422).json({ Error: "plz fill the field properly" });
    }
    try {
        const userExist = await User.findOne({
            email: email
        });
        if (userExist) {
            return res.status(422).json({ Error: "User already Exists" });
        } else if (password != cpassword) {
            return res.status(422).json({ Error: "Passwords are not matching " });
        } else {
            const user = new User({ name, email, password });
            await user.save();
            res.status(201).json({ message: "User registered successfully" });
        }
    } catch (err) {
        console.log(err);
    }
});

//User login
//-----------------------------------------
userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Fill both the fields" });
        }
        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Credentials" });
            } else {
                const token = await userLogin.generateAuthToken();
                console.log("token:", token);
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now + 25892000000),
                    httpOnly: true,
                });
                return res.json({ message: "User signedin successfully" });
            }
        } else {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
    } catch (err) {
        console.log(err);
    }
});
//Display Videos 
//-----------------------------------------
userRouter.get("/authenticate", Authenticate, async (req, res) => {
    const email = req.rootUser.email
    try {
        users = await User.findOne({ email: email });
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err)
    }
});
//User Logout 
//--------------------
userRouter.get("/logout", (req, res) => {
    console.log("Hello from Logout");
    res.clearCookie("jwtoken", { path: "/" });
    res.status(200).send("Logout User");
});

module.exports = userRouter;