const userAuth = require("../middleware/utils");
const express = require('express');
const connectionRequest = require("../models/connectionRequest");
const users = require("../models/users");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:touserID", userAuth, async (req, res) => {
    try {
        const fromUserID = req.user._id;
        const toUserID = req.params.touserID;
        const status =  req.params.status;
console.log("touseid",toUserID);

        const allowedStatus = ["ignored","intrested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"invalide status"+ status})
        }

        const existingConnectionRequest = await connectionRequest.findOne({
            $or:[
                {fromUserID,toUserID},
                {fromUserID:toUserID, toUserID:fromUserID}
            ]
        });
          const toUser = await users.findById(toUserID);
          if(!toUser){
                return res.status(400).json({message:"Invalid user "})   
        };
          

        if(existingConnectionRequest){
          return res.status(400).json({message:"Request alredy exist an not allow again "})   
        };
        
        const connection = new connectionRequest({
            fromUserID,
            toUserID,
            status
        })
       
        const data = await connection.save();

        res.json({message:"connection request send success", data})

    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {

        const loginUser = req.user;
        const {status , requestId} = req.params;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"invalide status"+ status})
        }

        const connection = await connectionRequest.findOne({
            _id:requestId,
            toUserID:loginUser._id,
            status:"intrested",
        });
          if(!connection){
                return res.status(400).json({message:"Invalid connection "})   
        };
        
        connection.status = status;
        const data = await connection.save()
        res.json({message:"connection request success", data})

    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = requestRouter;