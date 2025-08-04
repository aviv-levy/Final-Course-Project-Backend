const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    products: Array,
    address: Object,
    paypalPayment: Object,
    orderNumber: Number,
    buyer_id: String,
    status: String
})


module.exports = orderSchema;