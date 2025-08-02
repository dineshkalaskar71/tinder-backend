const userAuth = require("../middleware/utils");
const express = require('express');
const validatesignupdata = require('../utils/validation');
const User = require('../models/users');
const profilerouter = express.Router();
const validateuserProfile = require("../utils/validateuserProfile")

profilerouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.status(200).json({ message: `data fetch success`, data:user});
    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});

profilerouter.patch("/profile/edit", userAuth, async (req, res) => {
    console.log("edit");
    
    try {
        if(!validateuserProfile(req)){
            throw new Error("Edit not allow");
        };
        const user = req.user;

        Object.keys(req.body).forEach((key) =>(
      user[key] = req.body[key])
      )
      await user.save();
        res.status(200).json({message:`${user.firstName}, data updat success`,data:user} );
    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = profilerouter;