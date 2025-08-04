const mongoose = require("mongoose");

const Counterschema = new mongoose.Schema({
    title:{
        type: String,
        default: 'orderCounter'
    },
    orderCounter: Number
})


const CounterModel = mongoose.model("CounterModel", Counterschema, "counters");

module.exports = CounterModel;