const express = require("express");
const router = express.Router();
const UsersModel = require('../Models/userRegisterModel.js');

// http://localhost:4500/admin/getAllUsers
router.get('/getAllUsers', async (req, res) => {
    try {
        const users = await UsersModel.find({}, { _id: 1, firstname: 1, lastname: 1, email: 1, status: 1, biz: 1 });
        res.status(201).json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// http://localhost:4500/admin/updateStatus/:userId
router.put('/updateStatus/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await UsersModel.findOne({ _id: userId })
        if (user.status === 'Active')
            await UsersModel.updateOne({ _id: userId }, { $set: { status: 'Blocked' } })
        else
            await UsersModel.updateOne({ _id: userId }, { $set: { status: 'Active', loginTries: 0 } })
        const users = await UsersModel.find({}, { _id: 1, firstname: 1, lastname: 1, email: 1, status: 1, biz: 1 });
        res.status(201).json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// http://localhost:4500/admin/updateBiz/:userId
router.put('/updateBiz/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await UsersModel.findOne({ _id: userId })
        await UsersModel.updateOne({ _id: userId }, { $set: { biz: !user.biz } })

        const users = await UsersModel.find({}, { _id: 1, firstname: 1, lastname: 1, email: 1, status: 1, biz: 1 });
        res.status(201).json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
})


// http://localhost:4500/admin/deleteUser/:userId
router.delete('/deleteUser/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        await UsersModel.deleteOne({ _id: userId });

        const users = await UsersModel.find({}, { _id: 1, firstname: 1, lastname: 1, email: 1, status: 1, biz: 1 });
        res.status(200).json(users);

    } catch (err) {
        res.status(500).send(err.message);
    }
})




module.exports = router;