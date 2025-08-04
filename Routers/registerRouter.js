const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const UserRegisterModel = require('../Models/userRegisterModel.js');



// http://localhost:4500/register
router.post('/', async (req, res) => {

    try {
        // 1**. Validate the request with the JOI model
        const valRes = UserRegisterModel.validatePost(req.body); // synchronized method for running validations
        if (valRes.error)
            return res.status(400).send(valRes.error);

        // 2**. Create a Mongoose Model based on the JOI Model

        // Create a new user
        req.body.password = await bcrypt.hash(req.body.password, 10)
        const user = new UserRegisterModel(req.body);
        await user.save();

        res.status(201).send('User has been created')

    } catch (err) {
        res.status(500).send(err.message);
    }
})


module.exports = router;