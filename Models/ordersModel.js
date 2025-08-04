const JOI = require("joi");
const mongoose = require("mongoose");
const orderModelScheme = require('../Schemas/orderScehma.js');

// JOI Validations
const baselineValidation = {
    address: JOI.object({
        city: JOI.string().min(2).max(40).pattern(new RegExp("^[A-Za-z0-9? ,_-]+$")),
        street: JOI.string().min(2).max(40).pattern(new RegExp("^[A-Za-z0-9? ,_-]+$")),
        housenum: JOI.number(),
    }),
    paypalPayment: JOI.object(),
    products: JOI.array(),
};



// Post Validation
orderModelScheme.statics.validatePost = (obj) => {
    return JOI.object({
        ...baselineValidation,
        id: JOI.string().forbidden()
    }).validate(obj, { abortEarly: false });
}

const orderModel = mongoose.model("orderModel", orderModelScheme, "orders");

module.exports = orderModel;
