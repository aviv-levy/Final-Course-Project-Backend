const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserLoginModel = require('../Models/userLoginModel.js');



// http://localhost:4500/login
router.post('/', async (req, res) => {
    try {
        const currentTime = new Date();
        const blockDay = 86400000 //24 hours in milisecoends
        let { email, password } = req.body;
        const valRes = UserLoginModel.validatePost({ email, password }); // synchronized method for running validations
        if (valRes.error)
            return res.status(400).send('Email or password invalid please try again');

        const user = await UserLoginModel.findOne({ email: email });


        if (user === null)
            return res.status(401).send('Email or password invalid please try again');

        else if (user.status === 'Blocked') {
            if (currentTime - user.blockTime > blockDay)
                await UserLoginModel.updateOne({ _id: user._id }, { $set: { status: 'Active', loginTries: 0 } })
            else
                return res.status(403).send('User is blocked for 24 hours');
        }

        //      Check the password that sent from user, if it's correct send a token. 
        //      else send http status 401
        if (await bcrypt.compare(password, user.password.toString())) {
            user.password = undefined;
            user.blockTime = undefined;
            res.json({
                token: jwt.sign({ id: user.id, email: email, isAdmin: user.isAdmin }, process.env.SECRET, { expiresIn: '24h' }),
                userDetails: user,
            });
        }
        else {
            const time = new Date();
            await UserLoginModel.updateOne({ _id: user._id }, { $inc: { loginTries: 1 } })
            if (user.loginTries + 1 === 3)
                await UserLoginModel.updateOne({ _id: user._id }, { $set: { status: 'Blocked', blockTime: time.getTime() } })
            res.status(401).send('Email or password invalid please try again');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
})


module.exports = router;