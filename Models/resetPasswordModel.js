const JOI = require("joi");
const mongoose = require("mongoose");
const resetPasswordModelScheme = require('../Schemas/resetPasswordSchema.js');


// JOI Validations
const baselineValidation = {
    newPassword: JOI.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)
};



// Post Validation
resetPasswordModelScheme.statics.validatePost = (obj) => {
    return JOI.object({
        ...baselineValidation,
        id: JOI.string().forbidden()
    }).validate(obj, { abortEarly: false });
}

const resetPasswordModel = mongoose.model("resetPasswordModel", resetPasswordModelScheme, "resetTokens");

module.exports = resetPasswordModel;
