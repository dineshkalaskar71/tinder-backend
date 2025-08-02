const mongoose = require("mongoose")

const connectionRequest = new mongoose.Schema({
    fromUserID: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref:"users"
    },
    toUserID: {
        type:  mongoose.Schema.Types.ObjectId,
        require: true,
        ref:"users"
    },
    status: {
        type: String,
        require: true,
        enum:{
            values:["ignored","intrested","accepted","rejected"],
            message:`{VALUE} is not correct status type`,
        }
    },
}, {
    timestamps: true,
})

connectionRequest.index({fromUserID:1,toUserID:1})
const connectionRequestModel = new mongoose.model("connectionRequest", connectionRequest);

module.exports = connectionRequestModel;

