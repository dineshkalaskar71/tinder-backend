const mongoose = require("mongoose")

const connectdb = async()=>{
    await mongoose.connect("mongodb+srv://dineshkalaskar02001:ZL3IdHx36vpfxnOK@devbackend.yoaip1k.mongodb.net/?retryWrites=true&w=majority&appName=devbackend/tinder")
}

module.exports = connectdb;

