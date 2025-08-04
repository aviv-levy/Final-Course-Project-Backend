const JOI = require("joi");
const mongoose = require("mongoose");
const userModelScheme = require('../Schemas/userSchema.js');


// JOI Validations
const baselineValidation = {
    email: JOI.string().required().email(),
    password: JOI.string().required().min(6).max(40),
};



// Post Validation
userModelScheme.statics.validatePost = (obj) => {
    return JOI.object({
        ...baselineValidation,
        id: JOI.string().forbidden()
    }).validate(obj, { abortEarly: false });
}

const UserLoginModel = mongoose.model("UserLoginModel", userModelScheme, "users");

module.exports = UserLoginModel;
