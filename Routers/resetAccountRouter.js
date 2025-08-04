const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const MailSender = require('../Utils/mailSender');
const userUpdateModel = require('../Models/userLoginModel');
const resetPasswordModel = require('../Models/resetPasswordModel');

// Send reset password email
async function sendResetPasswordEmail(token, reciver) {

    const mailOptions = {
        from: 'finalproject1413@gmail.com',
        to: reciver,
        subject: 'FreeStyle - Password Reset',
        text: `Click on this link to reset your password: http://localhost:3000/reset-password/${token}`,
    };

    await MailSender(mailOptions)
}

// Check if the token is expired.
async function checkExpiredToken(token) {
    const user = await resetPasswordModel.findOne({ token: token });
    if (user === null)
        return true

    if (!moment().isBefore(user.expires))
        return true;
    return false;
}

// http://localhost:4500/resetAccount/:email
router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        if (!await userUpdateModel.findOne({ email: email }))
            return res.status(401).send('Email not found');

        await resetPasswordModel.deleteMany({ email: email })

        const token = jwt.sign({ email: email }, process.env.SECRET, { expiresIn: '1h' })
        const expires = moment().add(1, 'hour').format(); // Token expires in 1 hour

        // Store token and expiration in the database
        const user = new resetPasswordModel({ email: email, token: token, expires: expires });
        await user.save();

        //Send mail
        await sendResetPasswordEmail(token, email);

        res.status(200).send('Mail sent with link to reset')
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// http://localhost:4500/resetAccount/checkExpired
router.post('/checkExpired', async (req, res) => {
    try {

        if (await checkExpiredToken(req.body.token))
            return res.status(404).send();
        res.status(200).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// http://localhost:4500/resetAccount
router.post('/', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (await checkExpiredToken(token))
            return res.status(404).send();

        const valRes = resetPasswordModel.validatePost({ newPassword }); // synchronized method for running validations
        if (valRes.error) {
            return res.status(400).send(valRes.error);
        }


        const user = await resetPasswordModel.findOne({ token: token })

        // Update the user's password 
        await userUpdateModel.updateOne({ email: user.email }, { password: await bcrypt.hash(newPassword, 10) })

        // Remove the used token from the database
        await resetPasswordModel.deleteMany({ email: user.email })

        return res.status(200).send('Password reset successful');
    } catch (err) {
        res.status(500).send(err.message);
    }
})


module.exports = router;