
const userAuth = require("../middleware/utils");
const express = require('express');
const connectionRequest = require("../models/connectionRequest");
const users = require("../models/users");
const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedinuser = req.user

        const connection = await connectionRequest.find({
            toUserID: loggedinuser._id,
            status: "intrested"
        }).populate("fromUserID",["firstName","lastName"])

        if (!connection) {
           res.status(400).send({ error: "not a connection" });
        }

        res.status(200).json({ message: `data fetch success`, data: connection });
    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await connectionRequest.find({
            $or: [
                { fromUserID: loggedInUser._id },
                { toUserID: loggedInUser._id }
            ],
            status: "accepted"
        })
        .populate("fromUserID", ["firstName", "lastName","age",'skills']) 
        .populate("toUserID", ["firstName", "lastName","age",'skills'])



        if (!connections || connections.length === 0) {
            return res.status(404).json({ message: "No accepted connections found." });
        }
    //  const data = connections.map((row)=>row.fromUserID)

        res.status(200).json({ message: "Accepted connections fetched successfully", connections });
    } catch (err) {
        console.error("Connection fetch error:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page)|| 1;
        const limit = parseInt(req.query.limit)|| 10;
        const skip = (page-1)*limit;

        const connections = await connectionRequest.find({
            $or: [
                { fromUserID: loggedInUser._id },
                { toUserID: loggedInUser._id }
            ],
        }).select("fromUserID toUserID")
       
        const hideUserFromFeed = new Set();
        connections.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserID);
            hideUserFromFeed.add(req.toUserID);
        })

        const feedUsers = await users.find({
            $and:[{_id:{$nin: Array.from(hideUserFromFeed)}},
                {_id:{$ne:loggedInUser._id}}]
        }).select("firstName lastName age skills").skip(skip).limit(limit)

        res.status(200).json({ message: "feed fetched successfully", feedUsers   });
    } catch (err) {
        console.error("Connection fetch error:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
});


module.exports = userRouter;