const nodemailer = require('nodemailer');

async function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        // Send email with a link to reset the password
        const transporter = nodemailer.createTransport({
            // Configure your email provider here
            service: 'gmail',
            auth: {
                user: 'finalproject1413@gmail.com',
                pass: 'kngd xzlq zcnt ifka',
            },
        });
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                reject(error);
            } else {
                console.log('Email sent:', info.response);
                resolve(info);
            }
        });
    });
}


module.exports = sendEmail;