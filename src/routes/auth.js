const express = require('express');
const validatesignupdata = require('../utils/validation');
const User = require('../models/users');
const authrouter = express.Router();
const bcrypt = require('bcrypt');

authrouter.post("/signUp", async (req, res) => {

    try {
        validatesignupdata(req)
        const { password, firstName, lastName, emailid } = req.body
        const haspass = await bcrypt.hash(password, 10)

        const user = new User({
            firstName,
            lastName,
            emailid,
            password: haspass
        })
        await user.save();
        res.send("user signup success")
    }
    catch (err) {
        res.send("something went wrong " + err)
    }
})

authrouter.post("/login", async (req, res) => {

    try {

        const { password, emailid } = req.body
        const user = await User.findOne({ emailid: emailid })
        if (!user) {
            throw new Error("invalid User");
        }
        const isvpass = await user.validatePassword(password)
        if (isvpass) {

            const token = await user.getJWT()
            res.cookie("token", token, {
                httpOnly: true,        
                secure: false,        
                sameSite: "lax",     
                maxAge: 24 * 60 * 60 * 1000 
            });

            res.json({ message: "user login success", token });
        }
        else {
            res.send("invslid user")
        }
    }
    catch (err) {
        res.send("Something went wrong" + err.message)
    }
})
authrouter.post("/logout", async (req, res) => {

    try {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        })
        res.send("user logout success")
    }
    catch (err) {
        res.send("Something went wrong" + err.message)
    }


})

module.exports = authrouter;