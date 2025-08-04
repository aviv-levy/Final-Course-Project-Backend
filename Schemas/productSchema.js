const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    description: String,
    brand: String,
    category: String,
    gender: String,
    price: Number,
    sizeQuantity: Array,
    img: {
        type: String,
        default: 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
    },
    img_alt: String,
    userId: String
})


module.exports = ProductSchema;