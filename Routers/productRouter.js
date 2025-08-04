const express = require("express");
const router = express.Router();
const UserModel = require('../Models/userRegisterModel');
const ProductModel = require("../Models/productModel");
const verifyToken = require("../verifyToken");


//http://localhost:4500/products/getProductByCategory/:gender/:category
router.get('/getProductByCategory/:gender/:category', async (req, res) => {
    try {
        const gender = req.params.gender;
        const getcategory = req.params.category;
        const category = getcategory.charAt(0).toUpperCase() + getcategory.slice(1);

        const Products = await ProductModel.find({
            $or: [
                { gender: gender, category: category },
                { gender: 'Unisex', category: category }
            ]
        });
        if (Products === null)
            res.status(404).send('not found any')

        res.status(200).json(Products);
    } catch (err) {
        res.status(500).send(err.message);
    }
})


// http://localhost:4500/products/getMyProducts
router.get('/getMyProducts', verifyToken, async (req, res) => {
    try {
        const Products = await ProductModel.find({ userId: req.id });
        if (Products === null)
            res.status(404).send('not found any')

        res.status(200).json(Products);

    } catch (err) {
        res.status(500).send(err.message);
    }
})

// http://localhost:4500/products/getProduct/:productId
router.get('/getProduct/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const Product = await ProductModel.findOne({ _id: productId });
        if (Product === null)
            res.status(404).send('not found any')

        res.status(200).json(Product);

    } catch (err) {
        res.status(500).send(err.message);
    }
})

// http://localhost:4500/products/getFav
router.get('/getFav', verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.id });

        const favProducts = await ProductModel.find({ _id: { $in: user.favoriteProducts } })
        res.status(200).json(favProducts);

    } catch (err) {
        res.status(500).send(err.message);
    }
})

// http://localhost:4500/products/getCartProducts
router.get('/getCartProducts', verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.id });
        const userCartProducts = []
        user.cartProducts.forEach(product => userCartProducts.push(product.productId))
       
        const cartProducts = await ProductModel.find({ _id: { $in: userCartProducts } })
        res.status(200).json(cartProducts);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

//http://localhost:4500/products/updateProduct
router.put('/updateProduct',verifyToken ,async (req, res) => {
    try {
        const valRes = ProductModel.validatePut(req.body);
        if (valRes.error){
            console.log(valRes.error);
            return res.status(400).send(valRes.error);
        }

        await ProductModel.updateOne({ _id: req.body._id }, { $set: req.body })

        res.status(201).json('Product has been updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// http://localhost:4500/products/deleteProduct/:productId
router.delete('/deleteProduct/:productId', verifyToken, async (req, res) => {
    try {
        const productId = req.params.productId;
        const Users = await UserModel.find();

        await Promise.all(Users.map(async (user) => {
            if (user.cartProducts.find(product => product === productId))
                await UserModel.updateOne({ _id: user._id }, { $pull: { cartProducts: productId } })

            if (user.favoriteProducts.find(product => product === productId))
                await UserModel.updateOne({ _id: user._id }, { $pull: { favoriteProducts: productId } })

        }));

        await ProductModel.deleteOne({ _id: productId });

        res.status(204).send('Product has been deleted');

    } catch (err) {
        res.status(500).send(err.message);
    }
})


module.exports = router;