const jwt = require("jsonwebtoken")
const User = require("../models/users")
const userAuth = async(req, res, next) => {
    try {
        const { token } = req.cookies;
         if (!token) {
           throw new Error("invalid token")
        }
        const decodejwttoken = await jwt.verify(token, "jwtpass")
        const { _id } = decodejwttoken;

        const user = await User.findById(_id)
        if (!user) {
           throw new Error("User not found ")
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.send("error : "+err.message)
    }
}

module.exports = userAuth ;