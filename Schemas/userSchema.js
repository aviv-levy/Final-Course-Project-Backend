const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    img:{ 
        type:String,
        default: "https://brsc.sa.edu.au/wp-content/uploads/2018/09/placeholder-profile-sq.jpg"
    },
    img_alt: String,
    address: {
        type: Object,
        city: String,
        street: String,
        housenum: Number,
    },
    biz: Boolean,
    favoriteProducts: Array,
    cartProducts: Array,
    isAdmin: Boolean,
    status: {
        type: String,
        default: 'Active'
    },
    loginTries: {
        type: Number,
        default: 0
    },
    blockTime: Number
})


module.exports = UserSchema;