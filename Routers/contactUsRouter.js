const express = require("express");
const MailSender = require('../Utils/mailSender');
const router = express.Router();

// http://localhost:4500/contact
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (name.length < 2 || message.length < 2)
            return res.status(401).send('Incorrect data');

        const mailOptions = {
            from: 'finalproject1413@gmail.com',
            to: 'avvvviv@gmail.com',
            subject: `FreeStyle - Support ticket by ${email}`,
            text: `Name: ${name}
                    Email: ${email}
                    phone: ${phone}
                    ${message}`,
        };

        await MailSender(mailOptions);

        res.status(200).send('Mail has been sent')
    } catch (err) {
        res.status(500).send(err.message);
    }
})


module.exports = router;