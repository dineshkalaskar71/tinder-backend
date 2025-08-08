const { type } = require("express/lib/response")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailid: {
        type: String,
        require: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email" + value)
            }

        }
    },
    password: {
        type: String
    },
    skills: {
        type: [String]
    },
    age: {
        type: String
    },
}, {
    timestamps: true,
})

userSchema.methods.getJWT = async function () {

    const user = this;
    const token = await jwt.sign({_id:user._id}, "jwtpass",{expiresIn:"1d"})   
    return token;
}

userSchema.methods.validatePassword = async function (password) {

    const user = this;
    const passwordhash = user.password;
    const isPasswordValidate = await bcrypt.compare(password.trim(), passwordhash.trim());
    return isPasswordValidate;
}

module.exports =  mongoose.model("users", userSchema);

