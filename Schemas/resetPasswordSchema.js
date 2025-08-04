const mongoose = require("mongoose");


const resetPasswordSchema = new mongoose.Schema({
    email: String,
    token: String,
    expires: String
})


module.exports = resetPasswordSchema;