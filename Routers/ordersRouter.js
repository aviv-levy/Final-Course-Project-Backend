const express = require("express");
const router = express.Router();
const CountModel = require('../Schemas/counterSchema.js')
const OrderModel = require('../Models/ordersModel.js')
const ProductModel = require('../Models/productModel.js')

// http://localhost:4500/orders/createOrder
router.post('/createOrder', async (req, res) => {
    try {
        const { paypalPayment, address, products } = req.body;
        if (paypalPayment.status !== 'COMPLETED')
            return res.status(503).send('Service unavailable'); //Didn't recieve payment from paypal

        const valRes = OrderModel.validatePost(req.body); // JOI validation
        if (valRes.error)
            return res.status(400).send(valRes.error);

        let orderCount = await CountModel.findOneAndUpdate({ title: 'orderCounter' }, { $inc: { orderCounter: 1 } }, { new: true })
        if (orderCount === null) {
            orderCount = new CountModel({ orderCounter: 10003 })
            await orderCount.save();
        }

        const order = new OrderModel({
            products: products,
            address: address,
            paypalPayment: paypalPayment,
            orderNumber: orderCount.orderCounter,
            buyer_id: req.id,
            status: 'Pending'
        });
        await order.save();

        //Decrease quantity from products that purchased
        await Promise.all(products.map(async (product) => {
            await ProductModel.updateOne({ _id: product.product._id, "sizeQuantity.size": product.sizeQuantity.size }, { $inc: { "sizeQuantity.$.quantity": -product.sizeQuantity.quantity } })
        }))

        res.status(201).send('Order has been created')

    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
})


// http://localhost:4500/orders/getOrdersHistory
router.get('/getOrdersHistory', async (req, res) => {
    try {

        const Orders = await OrderModel.find({ buyer_id: req.id });
        if (Orders === null)
            res.status(404).send('not found any')

        res.status(200).json(Orders);
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
})



module.exports = router;