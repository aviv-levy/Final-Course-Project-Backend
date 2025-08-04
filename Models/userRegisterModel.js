const JOI = require("joi");
const mongoose = require("mongoose");
const userModelScheme = require('../Schemas/userSchema.js');



// JOI Validations
const baselineValidation = {
    firstname: JOI.string().required().min(2).max(20).alphanum(),
    lastname: JOI.string().required().min(2).max(20).alphanum(),
    phone: JOI.string().required().pattern(new RegExp("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$")),
    email: JOI.string().required().email(),
    password: JOI.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/),
    img: JOI.string().dataUri(),
    img_alt: JOI.string(),
    address: JOI.object({
        city: JOI.string().min(2).max(40).pattern(new RegExp("^[A-Za-z0-9? ,_-]+$")),
        street: JOI.string().min(2).max(40).pattern(new RegExp("^[A-Za-z0-9? ,_-]+$")),
        housenum: JOI.number(),
    }),
    biz: JOI.boolean(),
    favoriteProducts: JOI.allow(),
    cartProducts: JOI.allow(),
    status: JOI.allow(),
    loginTries: JOI.allow()
};

const ProfileImgValidation = {
    img: JOI.string().dataUri()
}


// Post Validation
userModelScheme.statics.validatePost = (obj) => {
    return JOI.object({
        ...baselineValidation,
        id: JOI.string().forbidden()
    }).validate(obj, { abortEarly: false });
}

// Put Validation
userModelScheme.statics.validatePut = (obj) => {
    return JOI.object({
        ...ProfileImgValidation,
        id: JOI.string().forbidden()
    }).validate(obj, { abortEarly: false });
}

const UserRegisterModel = mongoose.model("UserRegisterModel", userModelScheme, "users");

module.exports = UserRegisterModel;
